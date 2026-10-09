import math


def random_stream(seed):
    state = seed & 0xffffffff
    def draw():
        nonlocal state
        state = (1664525 * state + 1013904223) & 0xffffffff
        return state / 4294967296
    return draw


def split_data(seed):
    draw = random_stream(seed)
    def points(xs, prefix):
        return [{'id': prefix + str(i), 'x': x,
                 'y': 2*x + 1 + (draw() - 0.5)*0.08}
                for i, x in enumerate(xs)]
    return {'train': points([-1, -.6, -.2, .2, .6, 1], 'train-'),
            'validation': points([-.9, -.3, .3, .9], 'val-'),
            'test': points([-.8, -.4, 0, .4, .8], 'test-')}


def evaluate(points, model):
    loss = sum(0.5*(model['w']*p['x'] + model['b'] - p['y'])**2
               for p in points) / len(points)
    if not math.isfinite(loss):
        raise ValueError('Nonfinite loss; inspect the failing update.')
    return loss


def train(config):
    rate, epochs, size, seed = (config[k] for k in ('rate', 'epochs', 'batchSize', 'seed'))
    decay, optimizer, patience = (config[k] for k in ('decay', 'optimizer', 'patience'))
    integer = lambda v, lo, hi: type(v) in (int, float) and math.isfinite(v) and int(v) == v and lo <= v <= hi
    if not (type(rate) in (int, float) and math.isfinite(rate) and 0 < rate <= 2
            and integer(epochs, 1, 200) and integer(size, 1, 6)
            and integer(seed, 0, 0xffffffff) and integer(patience, 0, 20)
            and type(decay) in (int, float) and math.isfinite(decay) and 0 <= decay <= 1
            and optimizer in ('sgd', 'momentum', 'adam') and type(config['shuffle']) is bool):
        raise ValueError('Use rate (0,2], epochs 1–200, batch 1–6, seed 0–4294967295, decay 0–1 and patience 0–20.')
    epochs, size, seed, patience = map(int, (epochs, size, seed, patience))
    data = split_data(seed)
    draw = random_stream(seed ^ 0x12345678)
    initial = {'w': -0.5, 'b': 0}
    model, best = dict(initial), dict(initial)
    mw = mb = vw = vb = t = wait = 0
    best_epoch, stopped = 0, False
    best_loss = evaluate(data['validation'], model)
    batches = []
    history = [{'epoch': 0, 'training': evaluate(data['train'], model),
                'validation': best_loss, 'model': dict(model)}]
    for epoch in range(1, epochs + 1):
        rows = list(data['train'])
        if config['shuffle']:
            for i in range(len(rows) - 1, 0, -1):
                j = math.floor(draw() * (i + 1))
                rows[i], rows[j] = rows[j], rows[i]
        for start in range(0, len(rows), size):
            batch = rows[start:start + size]
            before = dict(model)
            predictions = [model['w']*p['x'] + model['b'] for p in batch]
            errors = [prediction - p['y'] for prediction, p in zip(predictions, batch)]
            gw = sum(e*p['x'] for e, p in zip(errors, batch))/len(batch) + decay*model['w']
            gb = sum(errors)/len(batch)
            t += 1
            if optimizer == 'sgd':
                model['w'] -= rate*gw
                model['b'] -= rate*gb
            elif optimizer == 'momentum':
                mw, mb = .9*mw + gw, .9*mb + gb
                model['w'] -= rate*mw
                model['b'] -= rate*mb
            else:
                mw, mb = .9*mw + .1*gw, .9*mb + .1*gb
                vw, vb = .999*vw + .001*gw*gw, .999*vb + .001*gb*gb
                model['w'] -= rate*(mw/(1 - .9**t))/(math.sqrt(vw/(1 - .999**t)) + 1e-8)
                model['b'] -= rate*(mb/(1 - .9**t))/(math.sqrt(vb/(1 - .999**t)) + 1e-8)
            if not all(math.isfinite(v) for v in (model['w'], model['b'], gw, gb)) or max(abs(model['w']), abs(model['b'])) > 1e8:
                raise ValueError('Unstable update; lower the learning rate and inspect gradients. No completed run is claimed.')
            batches.append({'epoch': epoch, 'ids': [p['id'] for p in batch],
                            'before': before, 'predictions': predictions,
                            'targets': [p['y'] for p in batch], 'gw': gw, 'gb': gb,
                            'after': dict(model)})
        training, validation = evaluate(data['train'], model), evaluate(data['validation'], model)
        history.append({'epoch': epoch, 'training': training, 'validation': validation, 'model': dict(model)})
        if validation < best_loss - 1e-10:
            best_loss, best, best_epoch, wait = validation, dict(model), epoch, 0
        else:
            wait += 1
        if patience and wait >= patience:
            stopped = True
            break
    mean_target = sum(p['y'] for p in data['train'])/len(data['train'])
    return dict(config=dict(config), **data, batches=batches, history=history,
                best=best, bestEpoch=best_epoch, initial=initial, stopped=stopped,
                baseline=evaluate(data['test'], {'w': 0, 'b': mean_target}))
