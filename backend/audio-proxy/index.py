import urllib.request
import base64

ALLOWED = {
    "track1": "https://files.catbox.moe/57i2o0.mp3",
    "track2": "https://files.catbox.moe/wwxsvw.mp3",
    "track3": "https://files.catbox.moe/k4hb46.mp3",
    "track4": "https://files.catbox.moe/whlrnp.mp3",
    "track5": "https://files.catbox.moe/pqkvab.mp3",
}

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range",
    "Access-Control-Max-Age": "86400",
}

def handler(event: dict, context) -> dict:
    """Прокси для аудиофайлов — обходит CORS ограничения catbox.moe"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    key = params.get("track", "")

    if key not in ALLOWED:
        return {"statusCode": 404, "headers": CORS, "body": "Not found"}

    url = ALLOWED[key]
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()

    encoded = base64.b64encode(data).decode("utf-8")
    return {
        "statusCode": 200,
        "headers": {
            **CORS,
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
        },
        "body": encoded,
        "isBase64Encoded": True,
    }
