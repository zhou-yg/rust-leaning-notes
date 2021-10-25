const d1 = require('./data/input-component.json');
const d2 = require('./data/test-component.json');
const d3 = require('./data/check-component.json');
const tf = require('@tensorflow/tfjs-node');

const PRESERVE_KEYS1 = [
  'ORIGIN_DEP_TYPE',
  'ORIGIN_RPC_LENGTH_TYPE',
  'ORIGIN_SCHEMA_KEYS_TYPE',
];

const PRESERVE_KEYS2 = [
  'ORIGIN_CSS_LENGTH_TYPE',
];

const PRESERVE_KEYS3 = [
  'ORIGIN_SRC_LENGTH_TYPE',
];

const PRESERVE_KEYS4 = [
  'ORIGIN_ROCOCO_MARK_TYPE',
]

const PRESERVE_KEYS = [
  PRESERVE_KEYS1,
  PRESERVE_KEYS2,
  PRESERVE_KEYS3,
  PRESERVE_KEYS4,
].flat();

function transData(d) {
  const { data } = d;

  // 归一化的极值准备
  const [k1MM, k2MM, k3MM] = [
    PRESERVE_KEYS1,
    PRESERVE_KEYS2,
    PRESERVE_KEYS3,
  ].map(keysArr => {
    
    const k1Arr = Object.keys(data).map(componentName => {
      const origins = data[componentName];
      return keysArr.map(typeKey => (origins[typeKey] && origins[typeKey].valueNum) || 0);
    }).flat();

    const min = Math.min(...k1Arr);
    const max = Math.max(...k1Arr);

    return [
      min,
      max,
      max - min,
    ];
  });
  

  const inputs = Object.keys(data).map(componentName => {
    const origins = data[componentName];
    const y = origins['ORIGIN_SCORE_TYPE'] && origins['ORIGIN_SCORE_TYPE'].valueNum || 1;
    const [x1Arr, x2Arr, x3Arr, x4Arr] = [
      PRESERVE_KEYS1,
      PRESERVE_KEYS2,
      PRESERVE_KEYS3,
      PRESERVE_KEYS4,
    ].map(arr => arr.map(k => (origins[k] && origins[k].valueNum) || 0));

    // 归一化处理
    const x1Normal = x1Arr.map(num => (num - k1MM[0]) / k1MM[2]);
    const x2Normal = x2Arr.map(num => (num - k2MM[0]) / k2MM[2]);
    const x3Normal = x3Arr.map(num => (num - k3MM[0]) / k3MM[2]);
    const x4Normal = [...x4Arr];

    return {
      componentName,
      x: [x1Normal, x2Normal, x3Normal, x4Normal].flat(),
      y,
    };
  });

  const xInputs = inputs.map(o => o.x);
  const yInputs = inputs.map(o => o.y);

  return { xInputs, yInputs};
}

function getModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [PRESERVE_KEYS.length],
    units: 250,
    activation: 'relu',
  }));
  model.add(tf.layers.dense({
    units: 175,
    activation: 'relu',
  }));
  model.add(tf.layers.dense({
    units: 50,
    activation: 'relu',
  }));

  model.add(tf.layers.dense({
    units: 5, // 
    activation: 'softmax',
  }));

  const optimizer = tf.train.adam();
  model.compile({
    optimizer,
    loss: 'sparseCategoricalCrossentropy', // tf.losses.meanSquaredError,
    metrics: ['accuracy'],
  });

  return model;
}

async function train(model, data, testData) {
  const inputX = tf.tensor(data.xInputs);
  const inputY = tf.tensor1d(data.yInputs);

  const testX = tf.tensor(testData.xInputs);
  const testY = tf.tensor1d(testData.yInputs);

  return model.fit(inputX, inputY, {
    validationData: [testX, testY],
    batchSize: 8,
    epochs: 10,
    shuffle: true,
    callbacks: {
      onTrainBegin(...args) {
        console.log('[fit callbacks] onTrainBegin', args);
      },
    },
  });
}



const data1 = transData(d1);
const data2 = transData(d2);
const model = getModel();
train(model, data1, data2).then(() => {
  const data3 = transData(d3);
  const checkX = tf.tensor(data3.xInputs);
  const checkY = tf.tensor1d(data3.yInputs);

  console.log('train end 开始预测 -->');

  const pred = model.predict(checkX);

  pred.print();

  checkY.print();
});

