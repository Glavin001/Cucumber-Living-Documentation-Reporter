const fs = require('fs');
const path = require('path');

const tf = require('@tensorflow/tfjs-node');
const UniversalSentenceEncoder = require('@tensorflow-models/universal-sentence-encoder');

const results = require('../fixtures/cucumber-results.json')

async function main() {

    const features = results;
    // console.log('features', features)
    // console.log('tf', UniversalSentenceEncoder)
    const model = await UniversalSentenceEncoder.load();
    /*
    const featureTexts = results.map((feature) => feature.name);
    const embeddings = await model.embed(featureTexts);
    const embeddingsArray = embeddings.arraySync();

    const featuresWithEmbeddings = features.map((feature, index) => {
        return {
            ...feature,
            embeddings: embeddingsArray[index],
        };
    });

    // Write to JSON file
    const outPath = '../fixtures/features-with-embeddings.json';
    const outPathAbs = path.resolve(__dirname, outPath);
    */
    const scenariosWithFeatures = features.map((feature) => {
        return feature.elements.map((scenario) => {
            return {
                ...scenario,
                feature,
            };
        });
    }).flat();
    // console.log('scenariosWithFeatures', scenariosWithFeatures)
    const scenarioTexts = scenariosWithFeatures.map((scenarioWithFeature) => textForScenario(scenarioWithFeature));
    console.log('scenarioTexts', JSON.stringify(scenarioTexts, null, 2))
    const embeddings = await model.embed(scenarioTexts);
    const embeddingsArray = embeddings.arraySync();
    const scenariosWithEmbeddings = scenariosWithFeatures.map((scenarioWithFeature, index) => {
        return {
            ...scenarioWithFeature,
            embedding: embeddingsArray[index],
        };
    });
    // console.log('scenariosWithEmbeddings', scenariosWithEmbeddings)
    const outPath = '../fixtures/scenarios-with-embeddings.json';
    writeFile(outPath, JSON.stringify(scenariosWithEmbeddings, null, 2));
}

function writeFile(filePath, contents) {
    const absFilePath = path.resolve(__dirname, filePath);
    fs.writeFile(absFilePath, contents, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function textForScenario({ feature, ...scenario }) {
    // return `${feature.name} ${scenario.name}`;
    const textForSteps = scenario.steps.map((step) => textForStep({ step })).join(' ');
    const text = `Feature: ${feature.name}
${feature.description}

Scenario: ${scenario.name}
${scenario.description}

${textForSteps}
`.trim();
    return text;
}
function textForStep({ step }) {
    return `${step.keyword.trim().toLowerCase()} ${step.name}`;
}

main();
