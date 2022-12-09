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

# Resize the image for preprocessing.
def pre(img_to_resize):
    img_pre = img_to_resize.resize((224, 224))
    img_pre = img_to_array(img_pre)
    img_pre = np.expand_dims(img_pre / 255, 0)
    return img_pre

# The model predicts an output depending on the image.
# Returns the confidence and the predicted class.
def get_trash(img):
    img = pre(Image.open('./Images/' + img))
    p = model.predict(img)

    confidences = max(np.squeeze(model.predict(img)))
    conf = round(confidences * 100, 1) 

    predicted_class = le.classes_[np.argmax(p[0], axis=-1)]
    print(predicted_class)

    return conf, predicted_class
    
'''
if __name__=='__main__':
    get_trash()
'''