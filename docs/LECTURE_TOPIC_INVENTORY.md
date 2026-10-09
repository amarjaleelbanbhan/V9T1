# Lecture topic inventory — supplied course summary

> Source: user-provided lecture-topic extract, received 2026-10-09. This is a planning source, **not an assertion that the original PowerPoint files were inspected**. All items are curriculum requirements; inclusion here does **not** mean the functionality exists.

## 1. Lecture 01 — Introduction to Deep Learning

Source: Deep Learining 01.pptx · 25 slides&#x20;

Deep Learining 01.pptx

- 1\. Data and its importance (slides 2–3)
  - “Data is the new oil” analogy
  - Data science and deep learning as data processing
  - Cambridge Analytica case study
  - Personal data, targeted advertisements, and political campaigns
  - Data privacy and the consequences of using personal information
- 2\. Introduction to AI (slides 4–7)
  - Fundamental concepts
  - Claims and applications of AI
  - Artificial Intelligence: meaning and definition
  - Symbolic AI and rule-based expert systems
  - Relationship between AI, ML, and DL
- 3\. Machine Learning fundamentals (slides 8–9)
  - Traditional programming vs. machine learning
  - Rules, data, and expected answers
  - Learning patterns from examples
  - Input data, expected output, and feedback signals
  - What is a representation?
  - RGB vs. HSV representation example
- 4\. Deep Learning fundamentals (slides 10–12)
  - Deep learning as a subset of ML
  - Layered representation learning
  - Hierarchical representation learning
  - Meaning of “deep”
  - How successive layers learn representations
  - Handwritten digit recognition diagrams
- 5\. How neural networks learn (slides 13–16)
  - Weights
  - Loss function
  - Optimizer
  - Prediction vs. true target
  - Loss score
  - Weight adjustment
  - Backpropagation and the training loop
- 6\. Achievements of Deep Learning (slide 17)
  - Image classification
  - Speech recognition
  - Handwriting transcription
  - Machine translation
  - Digital assistants
  - Autonomous driving
  - Search, advertising, and question answering
  - Game playing (Go)
- 7\. History of Machine Learning (slides 18–20)
  - Why not every ML problem needs DL
  - Probabilistic modeling
  - Early neural networks and the perceptron
  - Backpropagation and LeNet
  - Support Vector Machines
  - Decision trees and gradient boosting
  - GPU-based deep networks
  - ImageNet and AlexNet
- 8\. Why Deep Learning became successful (slides 21–25)
  - Automatic feature engineering
  - Incremental, layer-by-layer feature learning
  - Jointly optimized representations
  - Deep learning vs. traditional ML approaches
  - Kaggle and the ML landscape
  - GPU hardware and parallel computations
  - CUDA and TPUs
  - Better activation functions and weight initialization
  - Improved optimizers: RMSProp and Adam
  - Research investment
  - Open-source frameworks: Keras, TensorFlow, PyTorch
  - Opportunities and limitations of deep learning

## 2. Machine Learning Foundations, Model Evaluation & First Neural Network

Source: Deep_Learning_Lecture (1).pptx · 25 slides&#x20;

Deep_Learning_Lecture (1).pptx

- 1\. Types of Machine Learning (slides 3–8)
  - Supervised learning
  - Labeled input-output pairs
  - Classification: spam detection
  - Regression: house-price prediction
  - Unsupervised learning
  - Clustering: customer segmentation
  - Anomaly detection: unusual transactions
  - Reinforcement learning
  - Agents, actions, rewards, and penalties
  - Game playing and robotics
  - Comparison of the three learning types
- 2\. Classification model evaluation (slides 9–15)
  - Confusion matrix
  - True Positive (TP)
  - True Negative (TN)
  - False Positive (FP)
  - False Negative (FN)
  - Actual vs. predicted labels
  - Accuracy formula and calculation
  - Precision formula and calculation
  - Recall formula and calculation
  - Spam-filter numerical example
  - Why accuracy alone can mislead us
  - Precision vs. recall trade-offs
  - Examples involving disease screening and spam filtering
- 3\. MNIST handwritten digit classification (slides 16–19)
  - What is MNIST?
  - 60,000 training images and 10,000 test images
  - 28 × 28 grayscale image pixels
  - Ten digit classes: 0–9
  - Importing Keras
  - Loading data with `mnist.load_data()`
  - Images vs. labels
  - Exploring shapes and sample labels
  - Visualizing digit images with Matplotlib
- 4\. Building the neural network (slide 20)
  - Keras `Sequential`
  - Fully connected `Dense` layers
  - Hidden layer with 512 neurons
  - ReLU activation
  - Input shape `(784,)`
  - Output layer with 10 neurons
  - Softmax activation
- 5\. Compiling and preparing the model (slides 21–22)
  - `model.compile()`
  - RMSProp optimizer
  - Categorical cross-entropy loss
  - Accuracy metric
  - Reshaping 28 × 28 images into 784 values
  - Converting pixel data to `float32`
  - Normalization by dividing by 255
  - One-hot encoding labels with `to_categorical()`
- 6\. Training and evaluation (slides 23–25)
  - `model.fit()`
  - Epochs
  - Batch size
  - `model.evaluate()`
  - Training accuracy vs. test accuracy
  - Experimenting with epochs
  - Changing hidden layer sizes
  - Building a confusion matrix for model predictions

## 3. Chapter 2 — Mathematical Building Blocks of Neural Networks

Source: Chapter2_Lecture (1).pptx · 15 slides&#x20;

Chapter2_Lecture (1).pptx

- 1\. First neural network (slides 3–8)
  - MNIST image classification
  - Loading training and test data
  - Building a Dense network
  - ReLU and softmax
  - Compiling with RMSProp and categorical cross-entropy
  - Reshaping and normalizing images
  - Training with epochs and batches
  - Evaluating training vs. test accuracy
  - Overfitting and generalization
  - Experiments with epochs and batch sizes
- 2\. Data representations (slides 9–12)
  - What is a tensor?
  - Scalar (0D)
  - Vector (1D)
  - Matrix (2D)
  - Higher-dimensional tensors
  - Rank / number of axes
  - Shape
  - Data type (`dtype`)
  - `np.array()`
  - `.ndim`, `.shape`, `.dtype`
  - MNIST image tensor: `(60000, 28, 28)`
- 3\. Tensor slicing (slides 13–14)
  - Indexing vs. slicing
  - Selecting ranges of images
  - Exclusive ending index
  - Colon `:` notation
  - Slicing different axes
  - Cropping images
  - Negative indices
  - Selecting and visualizing batches
- 4\. Real-world tensor representations (slide 15)
  - Vector data: `(samples, features)`
  - Time-series data: `(samples, timesteps, features)`
  - Image data: `(samples, height, width, channels)`
  - Video data: `(samples, frames, height, width, channels)`

## 4. Lecture 03 — Data Representations, Tensors & Neural Networks

Source: Lecture-03 (2).pptx · 37 slides&#x20;

Lecture-03 (2).pptx

- 1\. Introduction to tensors (slides 1–3)
  - Definition of a tensor
  - Tensors as data containers
  - Dimensions and axes
  - Matrix vs. tensor
  - Activity: recognizing the rank of different kinds of data
- 2\. Types of tensors (slides 4–8)
  - 0D tensor — scalar
  - 1D tensor — vector
  - 2D tensor — matrix
  - 3D tensor — stack of matrices
  - 4D and 5D tensors
  - Difference between vector dimensionality and tensor rank
  - Creating tensors with NumPy
  - Practice predicting `.ndim` and `.shape`
- 3\. Three tensor attributes (slides 9–12)
  - Rank / `ndim`
  - Shape / `.shape`
  - Data type / `.dtype`
  - Scalar shape `()`
  - Vector shape `(5,)`
  - Matrix shape `(rows, columns)`
  - `float32`, `float64`, `uint8`
  - Memory usage and numerical precision
- 4\. MNIST tensor inspection (slides 13–14)
  - Loading MNIST using Keras
  - Training and test arrays
  - Inspecting rank, shape, and dtype
  - `(60000, 28, 28)`
  - Understanding the sample axis
- 5\. Tensor slicing (slides 15–18)
  - Selecting a single element
  - Selecting a range of elements
  - Indexing vs. slicing
  - Start and stop indices
  - Excluding the stop index
  - Colon `:` syntax
  - Slicing across multiple axes
  - Cropping images
  - Negative indexing
  - Practice exercises with MNIST
- 6\. Data batches (slide 19)
  - Samples axis
  - Batch size
  - First batch and next batch
  - Batch indexing using `128*n : 128*(n+1)`
- 7\. Real-world tensor data (slides 20–25)
  - Vector/tabular data — 2D
  - Time-series and sequence data — 3D
  - Image data — 4D
  - Video data — 5D
  - Samples, timesteps, features
  - Height, width, channels, frames
  - Activity: calculate tensor shapes for different datasets
- 8\. Artificial neural networks (slides 26–37)
  - Definition of an artificial neuron
  - Inputs and weights
  - Weighted sum / net input
  - Dot product
  - NumPy `np.dot()` and `@`
  - Bias
  - Activation function
  - Why nonlinear activation matters
  - ReLU, sigmoid, tanh
  - Neuron, layer, and network
  - Input, hidden, and output layers
  - Forward propagation
  - Building a small neuron using NumPy
  - Practice changing weights and biases

## 5. Complete Neuron Story — Biological Neuron to Neural Network

Source: DL_Complete_Neuron (2).pptx · 25 slides&#x20;

DL_Complete_Neuron (2).pptx

- 1\. Biological inspiration (slides 2–5)
  - Can a machine learn without explicitly written rules?
  - Spam-detection example
  - Biological neurons
  - Dendrites
  - Soma / cell body
  - Axon
  - Synapse
  - Biological vs. artificial neuron
  - Mapping biological functions to artificial neuron components
- 2\. Artificial neuron (slides 6–13)
  - Inputs \\(x_1,x_2,x_3\\)
  - Weights \\(w_1,w_2,w_3\\)
  - Weighted contributions
  - Weighted sum
  - Why inputs have different importance
  - Bias and its purpose
  - Bias as a shift or intercept
  - Bias vs. activation function
  - Decision threshold
  - Net input: \\(z=\sum wx+b\\)
  - Output: \\(a=f(z)\\)
  - ReLU calculation
  - Hand calculations and class activities
- 3\. Perceptron (slides 14–17)
  - Definition of a perceptron
  - Frank Rosenblatt and the perceptron
  - Step activation function
  - Binary output: 0 or 1
  - Perceptron decision rule
  - Bias and threshold
  - AND gate
  - AND truth table
  - OR gate
  - Implementing logic gates with a perceptron
- 4\. Building a neural network (slides 18–20)
  - Limitations of a single neuron
  - Difference between neuron, layer, and network
  - Connections and weights between layers
  - Hidden neurons
  - Sigmoid activation
  - Network architecture diagram
- 5\. Forward propagation (slides 21–24)
  - Input-to-output information flow
  - Hidden-layer weighted sums
  - Hidden-layer activations
  - Output-neuron weighted sum
  - Output activation
  - Numerical forward-pass example
- 6\. Measuring prediction error (slide 25)
  - Actual target vs. prediction
  - Squared loss with a factor of ½
  - Loss calculation by hand
  - Why weights and biases must be updated

## 6. Lecture 04 — Forward Propagation, Gradient Descent & Backpropagation

Source: Lecture-04 (1).pptx · 20 slides&#x20;

Lecture-04 (1).pptx

- 1\. Forward propagation (slides 2–3)
  - Forward-pass network diagram
  - Input values
  - Connection weights
  - Hidden neurons
  - Output prediction
- 2\. Loss calculation (slide 4)
  - Actual value
  - Predicted value
  - Calculating prediction error
- 3\. Optimizers (slides 5–7)
  - Why loss must be minimized
  - Why weights must change
  - Definition of an optimizer
  - Loss as a function of weight
  - Gradient and its purpose
- 4\. Slope and derivatives (slides 8–10)
  - Meaning of slope
  - Change in loss vs. change in weight
  - Derivative at a point
  - Positive gradient
  - Negative gradient
  - Zero gradient
- 5\. Gradient descent (slides 11–13)
  - Why we move opposite to the gradient
  - Gradient descent formula
  - Learning rate \\(\eta\\)
  - Weight update:

\\[ w\_{\text{new}}=w\_{\text{old}}-\eta\frac{dL}{dw} \\]

- Numerical iterations using \\(L(w)=w^2\\)
- Starting weight and learning rate
- 6\. Backpropagation (slides 14–20)
  - Why gradients must travel backward
  - Determining which weights should change
  - Chain rule of differentiation
  - Intermediate calculations
  - Input → weighted sum → activation → loss
  - Computational graph
  - Worked numerical example
  - Calculating the loss gradient with respect to a weight

## 7. Lecture 05 — Vanishing Gradients, ANN Implementation & IMDB

Source: Lecture-05 (2).pptx · 93 slides&#x20;

Lecture-05 (2).pptx

This is your largest lecture. It contains three major parts.

### Part A — Vanishing Gradient Problem (slides 1–17)

- 1\. Vanishing gradients
  - Meaning of the vanishing gradient problem
  - Photocopy analogy
  - Deep networks with many layers
  - Forward vs. backward propagation
  - Shrinking gradients during backpropagation
  - Why early layers learn slowly
- 2\. Sigmoid and its derivative
  - Sigmoid activation function
  - Sigmoid output range
  - Differentiation using the power rule
  - Differentiation using the chain rule
  - Simplifying the derivative to \\(h(1-h)\\)
  - Maximum sigmoid derivative of 0.25
- 3\. Mathematical explanation
  - Chain rule across multiple layers
  - Multiplication of small derivatives
  - Numerical example: \\(0.25^5\\)
  - Effect on early-layer weights
- 4\. Complete numerical example
  - Four-layer example network
  - Forward pass through each layer
  - Sigmoid values
  - Squared-error loss
  - Local derivatives
  - Backward-pass gradient
  - Weight update using a learning rate
  - Interpreting the very small weight change

### Part B — Building and Training an ANN (slides 18–64)

- 1\. Dataset and features (slides 18–28)
  - Complete ML workflow
  - Inputs `X` and targets `y`
  - Samples vs. features
  - Creating datasets with `np.array()`
  - Reading shapes such as `(6,1)` and `(6,3)`
  - Numerical features
  - Binary labels
  - Creating vs. loading data
- 2\. Splitting data (slides 29–31)
  - Training and test sets
  - NumPy slicing
  - `train_test_split()`
  - `test_size`
  - `random_state`
  - Checking input and label shapes
- 3\. Designing an ANN (slides 32–39)
  - Input layer
  - Hidden layers
  - Output layer
  - ReLU and sigmoid
  - Importing Keras
  - `Sequential()`
  - `Dense()`
  - Units and activation arguments
  - `input_shape`
  - `model.summary()`
  - Output shapes
  - Weights and biases
  - Calculating trainable parameters layer by layer
- 4\. Compiling and training (slides 40–44)
  - Difference between creating and compiling a model
  - Adam optimizer
  - Binary cross-entropy
  - Accuracy metric
  - `model.compile()`
  - `model.fit()`
  - Epochs
  - Batch size
  - Validation split
  - Forward and backward passes during training
  - `history.history`
- 5\. Training curves and overfitting (slides 45–52)
  - Training loss graph
  - Validation loss graph
  - Training accuracy graph
  - Validation accuracy graph
  - Recognizing overfitting
  - Training vs. validation vs. test data
  - Why not to tune using the test set
- 6\. Evaluation and predictions (slides 53–54)
  - `model.evaluate()`
  - Test loss and accuracy
  - `model.predict()`
  - Probabilities
  - Converting probabilities into classes
  - Classification threshold 0.5
- 7\. Binary cross-entropy calculations (slides 55–58)
  - Binary cross-entropy formula
  - True target \\(y\\)
  - Predicted probability \\(\hat y\\)
  - Calculating loss for correct predictions
  - Calculating loss for incorrect predictions
  - Comparing loss values by hand
- 8\. Full practical lab (slides 59–64)
  - Dataset creation
  - Train/test split
  - ANN architecture
  - Model summary
  - Compilation
  - Training
  - Evaluation
  - Prediction
  - Plotting loss and accuracy
  - Experiments with epochs, neurons, test-set size, and prediction thresholds

### Part C — IMDB Movie Review Classification (slides 65–93)

- 1\. IMDB dataset (slides 65–69)
  - Movie-review sentiment classification
  - Positive and negative reviews
  - Training and testing data
  - `imdb.load_data()`
  - `num_words=10000`
  - Word indices
  - Review labels
  - Inspecting a review
- 2\. Text vectorization (slides 70–78)
  - Why reviews have different lengths
  - Why Dense layers need fixed-size input
  - One-hot / multi-hot vector representation
  - `np.zeros()`
  - `vectorize_sequences()`
  - `enumerate()`
  - Setting vector positions to 1
  - Vectorizing training and test reviews
  - Converting labels to `float32`
  - Shapes `(25000,10000)` and `(25000,)`
- 3\. Building the IMDB model (slides 79–81)
  - 10,000 input features
  - Two hidden layers of 16 neurons
  - ReLU activation
  - One sigmoid output
  - Keras Sequential network
  - Parameter counting
  - `model.summary()`
- 4\. Compiling the IMDB model (slides 82–83)
  - RMSProp
  - Binary cross-entropy
  - Accuracy
  - String configuration vs. Keras objects
  - Learning rate
- 5\. Validation and training (slides 84–85)
  - Separating 10,000 validation reviews
  - Training using 15,000 reviews
  - Keeping the test set untouched
  - Training for 20 epochs
  - Batch size of 512
- 6\. Reading training results (slides 86–88)
  - Training vs. validation loss
  - Training vs. validation accuracy
  - Plotting graphs using Matplotlib
  - Detecting overfitting
  - Choosing the appropriate training duration
- 7\. Retraining and testing (slides 89–91)
  - Creating a fresh model
  - Retraining for four epochs
  - Using the full training set
  - Evaluating on unseen test reviews
  - Predicting sentiment probabilities
  - Converting probabilities to positive/negative classes
- 8\. IMDB experiments and revision (slides 92–93)
  - Increasing hidden-layer units
  - Adding or removing hidden layers
  - Changing binary cross-entropy to MSE
  - Changing ReLU to tanh
  - Comparing validation curves
  - Reviewing the complete model-training workflow
