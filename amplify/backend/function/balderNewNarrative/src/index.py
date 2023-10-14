import json
import sys
from pip._internal import main

main(
    [
        "install",
        "-I",
        "-q",
        "boto3",
        "--target",
        "/tmp/",
        "--no-cache-dir",
        "--disable-pip-version-check",
    ]
)
sys.path.insert(0, "/tmp/")
import boto3

translate = boto3.client(service_name="translate")
bedrock = boto3.client(service_name="bedrock-runtime")


def translate_text(text, language):
    response = translate.translate_text(
        Text=text,
        SourceLanguageCode=language,
        TargetLanguageCode="en",
        Settings={"Formality": "FORMAL"},
    )
    return response["TranslatedText"]


def generate_narrative(text):
    prompt = f"""
Rephrase the text between ### and ###
### {text} ###
Only answer with the rphrased text. Ideally the output should have 400 words
    """
    modelId = "anthropic.claude-v2"
    accept = "application/json"
    contentType = "application/json"
    body = json.dumps(
        {
            "prompt": "\n\nHuman: " + prompt + "\n\nAssistant:",
            "max_tokens_to_sample": 300,
            "temperature": 0.1,
            "top_p": 0.9,
        }
    )
    response = bedrock.invoke_model(
        body=body, modelId=modelId, accept=accept, contentType=contentType
    )
    response_body = json.loads(response.get("body").read())
    return response_body["completion"]


def handler(event, context):
    print("received event:")
    print(event)

    body = json.loads(event["body"])

    text = body["text"]
    language = body["language"]
    if language != "en":
        translated_text = translate_text(text, language)
        narrative = generate_narrative(translated_text)
    else:
        narrative = generate_narrative(text)
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(narrative),
    }
