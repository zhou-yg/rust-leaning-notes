const tf = require('@tensorflow/tfjs');

const {
  generateData
} = require('./data');

//set up variables
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));
//build a model
function predict(x) {
  return tf.tidy(() => {
    return a.mul(x.pow(tf.scalar(3)))
      .add(b.mul(x.square()))
      .add(c.mul(x))
      .add(d);
  });
};

function loss(predictions, labels) {
  const meanSquareError = predictions.sub(labels).square().mean();
  return meanSquareError;
}

function train(xs, ys, numIterations = 75) {
  const learningRate = 0.5;
  const optimizer = tf.train.sgd(learningRate);
  for (let i = 0; i < numIterations; i++) {
    optimizer.minimize(() => {
      const predsYs = predict(xs);
      return loss(predsYs, ys);
    })
  }
}

async function main() {
  const trueCoefficients = {
    a: 1,
    b: 2,
    c: .9,
    d: .5
  };
  const trainingData = generateData(100, trueCoefficients);

  train(trainingData.x, trainingData.yNormalized);

  [a,b,c,d].map(v => v.print());
}

main();a