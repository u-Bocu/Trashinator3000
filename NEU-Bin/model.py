from keras.models import load_model
from keras.utils import img_to_array
from sklearn.preprocessing import LabelEncoder
import numpy as np
from PIL import Image

# Load model
model = load_model('model_5class_resnet_87%.h5')

labels = ['G&M', 'Organic', 'Other', 'Paper', 'Plastic']
le = LabelEncoder()
labels = le.fit_transform(labels)


def pre(img_to_resize):
    img_pre = img_to_resize.resize((224, 224))
    img_pre = img_to_array(img_pre)
    img_pre = np.expand_dims(img_pre / 255, 0)
    return img_pre


img = pre(Image.open('./Dataset_resized_2.0/Plastic/7.jpg'))
p = model.predict(img)
confidences = max(np.squeeze(model.predict(img)))
conf = round(confidences, 3)
predicted_class = le.classes_[np.argmax(p[0], axis=-1)]
print(predicted_class)
