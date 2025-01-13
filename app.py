from google.cloud import vision
from google.cloud.vision import types

def detect_labels(image_path):
    client = vision.ImageAnnotatorClient()

    with open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    print('Labels:')
    for label in labels:
        print(label.description)

# Use your image file path here
detect_labels('path/to/your/image.jpg')
