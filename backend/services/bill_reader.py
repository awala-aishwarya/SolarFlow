
import os
import json
from pathlib import Path
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

def read_electricity_bill(file_path: str):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing from .env")

    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError("Electricity bill not found")

    mime_types = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }

    mime_type = mime_types.get(path.suffix.lower())

    if not mime_type:
        raise ValueError("Unsupported file format")

    client = genai.Client(api_key=api_key)

    prompt = """
    Extract these fields from the electricity bill:
    - consumer_number
    - tariff
    - sanctioned_load_kw
    - monthly_units
    - monthly_bill_amount

    Return valid JSON with exactly these keys.
    Use null for any missing or unclear value.
    Do not guess missing information.
    """


    response = None

    # Retry Gemini API up to 3 times if the server is temporarily unavailable
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=[
                    prompt,
                    types.Part.from_bytes(
                        data=path.read_bytes(),
                        mime_type=mime_type
                    )
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            break

        except Exception as e:
            error_message = str(e)

            if "503" in error_message or "UNAVAILABLE" in error_message:
                print(
                    f"Gemini temporarily unavailable. Retry {attempt + 1}/3"
                )

                if attempt < 2:
                    time.sleep(3 * (attempt + 1))
                else:
                    raise
            else:
                raise

    # Validate Gemini response
    if response is None or not response.text:
        raise ValueError("Gemini returned an empty response")

    # Convert JSON response into Python dictionary
    result = json.loads(response.text)

    # Fields required from the electricity bill
    required_fields = [
        "consumer_number",
        "tariff",
        "sanctioned_load_kw",
        "monthly_units",
        "monthly_bill_amount"
    ]

    # Return only the required fields
    return {
        field: result.get(field)
        for field in required_fields
    }