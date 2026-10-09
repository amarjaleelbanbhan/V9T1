import foundationData from './foundations.json';
import neuralData from './neural.json';
import type {Lesson} from './types';
export const beginnerLessons=[...foundationData,...neuralData] as unknown as Lesson[];
export const beginnerChapters=[{id:'CH-00',title:'Python, data and mathematics'},{id:'CH-01',title:'AI, ML and evaluation'},{id:'CH-02',title:'Neurons and activations'},{id:'CH-03',title:'Tensors and computation'},{id:'CH-04',title:'Forward propagation'}];
