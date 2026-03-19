def is_valid_image(data: bytes) -> bool:
    """Validate image by magic bytes, not file extension."""
    if len(data) < 12:
        return False
    if data[:3] == b"\xff\xd8\xff":                     # JPEG
        return True
    if data[:8] == b"\x89PNG\r\n\x1a\n":                # PNG
        return True
    if data[:6] in (b"GIF87a", b"GIF89a"):              # GIF
        return True
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":   # WebP
        return True
    return False
