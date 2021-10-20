/**
 * 手动写优化器，训练器
 */ 
const tf = require('@tensorflow/tfjs-node');

function linearFunc(size, noRandom) {
  const k = 5;
  const b = 10;

  const fx = (x) => x * k + b;
  
  let i = 0;
  const x = [];
  const y = [];
  while (i < size) {
    x.push(i);
    y.push(fx(i));
    i++;
  }

  return {
    x,
    y,
  };
}



function getModel() {

  const a = tf.variable(tf.scalar(Math.random() * 5));
  const b = tf.variable(tf.scalar(Math.random() * 5));
  const c = tf.variable(tf.scalar(Math.random()));
  const d = tf.variable(tf.scalar(Math.random()));

  function predict(x) {
    return tf.tidy(() => {
      return a.mul(x).add(b);
    });
  };
  async function fit(inputsX, testsY, { loss }) {
    let i = 0;
    const trainSize = 10 || inputsX.size;

    const learningRate = 0.05;
    const optimizer = tf.train.sgd(learningRate);

    while (i < trainSize) {
      optimizer.minimize(() => {
        const pred = predict(inputsX);
        const realY = testsY
        
        pred.print();
        realY.print();
        console.log(`======= ${pred.size}, ${realY.size}`);

        return loss(pred, realY);
      });
      i++;
    }
  }

  return {
    parameters: [a, b, c, d],
    predict,
    fit,
  };
}

async function train(model) {

  const trainSize = 100;

  const [trainXs, trainYs] = tf.tidy(() => {
    const { x, y } = linearFunc(trainSize);

    return [
      x,
      y,
    ].map(v => tf.tensor1d(v));
  });


  const loss = (prediction, actualValue) => {
    return prediction.sub(actualValue).square().mean();
  };


  return model.fit(trainXs, trainYs, {
    loss,
  });
}



function doPrediction(model, x) {
  const testX = tf.tensor1d([x]);

  const preds = model.predict(testX);

  testX.dispose();

  console.log('----- check doPrediction -------')
  preds.print();
}

async function run() {
  const model = getModel();
  await train(model);

  console.log('--- 训练结果 ---')

  model.parameters.map(tensor => tensor.print());

  doPrediction(model, 1);
  doPrediction(model, 2);

  console.log(linearFunc(3))
}

run();