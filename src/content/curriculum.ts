/** Ordered according to the supplied Sukkur IBA Fall 2026 course outline. */
export const curriculum = [
  { id:'intro', title:'Deep Learning Foundations', week:'Week 1', status:'ready' },
  { id:'neuron', title:'The Artificial Neuron', week:'Week 2', status:'ready' },
  { id:'perceptron', title:'Perceptron & Logic Gates', week:'Neuron Story · Slides 14–17', status:'ready' },
  { id:'tensor', title:'Tensors & Slicing', week:'Lectures 02–03', status:'ready' },
  { id:'propagation', title:'Forward Propagation', week:'Weeks 3–4', status:'ready' },
  { id:'backprop', title:'Backpropagation & Chain Rule', week:'Weeks 3–4', status:'ready' },
  { id:'activation', title:'Activation Functions', week:'Week 4', status:'ready' },
  { id:'loss', title:'Loss & Gradient Descent', week:'Lecture 04 · Slides 4–13', status:'ready' },
  { id:'gradient-depth', title:'Vanishing & Exploding Gradients', week:'Lecture 05 · Slides 1–17', status:'ready' },
  { id:'optimizers', title:'Optimizers', week:'Weeks 6–7', status:'planned' },
  { id:'cnn', title:'CNN Operations', week:'Week 8', status:'planned' },
  { id:'advanced-cnn', title:'CNN Architectures', week:'Week 10', status:'planned' },
  { id:'nlp', title:'Text Representations', week:'Weeks 11–12', status:'planned' },
  { id:'rnn', title:'RNN, LSTM & GRU', week:'Weeks 12–14', status:'planned' },
  { id:'transformers', title:'Transformers', week:'Week 15', status:'planned' },
] as const;
