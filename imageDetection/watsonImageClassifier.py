import requests
import json
import fileinput
import shutil
import os

class Image_Classification():
	def __init__(self):
		self.params = (('version', '2018-03-19'),)
		self.files = {}
		self.api_key = "Roqb-dXfiS5cjczmapZgmOHWyDivGoVEnWQVM0Loi2ic"
		self.service_endpoint = "https://api.us-south.visual-recognition.watson.cloud.ibm.com"

	def create_request(self):
		return self.load_as_json(requests.post(f'{self.service_endpoint}/v3/classifiers', params=self.params, files=self.files, auth=('apikey', f'{self.api_key}')))

	def initialize_fileDict(self, file_names):
		sample_var = 0
		print(file_names)
		for variable in file_names:
			self.files.update({f'person{sample_var}_positive_examples' : (file_names[sample_var], open(file_names[sample_var], "rb"))})
			sample_var += 1

	def retrieve_classifer_detail(self, name_classifier):
		return self.load_as_json(requests.get(f'{self.service_endpoint}/v3/classifiers/{name_classifier}', params=self.params, auth=('apikey', f'{self.api_key}')))

	def create_classifer_name(self, classifier_name):
		self.files.update({'name': (None, classifier_name)})

	def initialize_threshold(self, threshold_value='0.8'):
		self.files.update({'threshold': (None, threshold_value)})

	def recognize_image(self, file_name, name_classifier):
		self.files.update({'images_file': (file_name, open(file_name, "rb"))})
		self.files.update({'owners': (None,"me")})
		self.initialize_threshold()
		print(self.load_as_json(requests.post(f'{self.service_endpoint}/v3/classify/', params=self.params, files = self.files, auth=('apikey', f'{self.api_key}'))))

	def create_classifier(self, classifier_name, file_list):
		self.zip_folders(file_list)
		self.initialize_fileDict(file_list)
		self.create_classifer_name(classifier_name)
		print(self.create_request())

	def retrieve_classifier_list(self):
		return self.load_as_json(requests.get(f'{self.service_endpoint}/v3/classifiers?verbose=true', params=self.params, auth=('apikey', f'{self.api_key}')))

	def update_classifier(self, file_names_additional, name_classifier):
		self.initialize_fileDict(file_names_additional)
		return self.load_as_json(requests.post(f'{self.service_endpoint}/v3/classifiers/{name_classifier}', params=self.params, files=self.files, auth=('apikey', f'{self.api_key}')))

	def delete_classifier(self, name_classifier):
		return self.load_as_json(requests.delete(f'{self.service_endpoint}/v3/classifiers/{name_classifier}', params=self.params, auth=('apikey', f'{self.api_key}')))

	def reset_variables(self):
		self.files = {}

	def load_as_json(self, text):
		return json.loads(text.text)

	def zip_folders(self, folders):
		for folder in folders:
			print(folder)
			directory = os.getcwd()
			shutil.make_archive(os.path.join(directory, f"{folder}"), 'zip', os.path.join(directory, f"{folder}"))



