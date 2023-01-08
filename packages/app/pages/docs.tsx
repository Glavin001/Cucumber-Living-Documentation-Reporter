import styles from '../styles/Home.module.css'
import Link from 'next/link'
import classNames from 'classnames'
import Script from 'next/script'
import { sortBy } from 'lodash';

// import '@tensorflow/tfjs';

// import tf from '@tensorflow/tfjs-node';

// import UniversalSentenceEncoder from '@tensorflow-models/universal-sentence-encoder';

import { Dispatch, Fragment, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { PaperClipIcon } from '@heroicons/react/20/solid'

// import results from '../fixtures/cucumber-results.json'
import { Tensor2D } from '@tensorflow/tfjs';
// import results from '../fixtures/cucumber-report-work.json'
// import features from '../fixtures/features-with-embeddings.json'
import scenariosWithEmbeddings from '../fixtures/scenarios-with-embeddings.json'

interface Props {
  // features: FeatureWithEmbeddings[];
  scenarios: ScenarioWithEmbedding[];
}


function dot(a, b){
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sum = 0;
  for (var key in a) {
    if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
      sum += a[key] * b[key]
    }
  }
  return sum
}

function similarity(a, b) {
  var magnitudeA = Math.sqrt(dot(a, a));
  var magnitudeB = Math.sqrt(dot(b, b));
  if (magnitudeA && magnitudeB)
    return dot(a, b) / (magnitudeA * magnitudeB);
  else return false
}

export async function getStaticProps() {

  // const features = results;
  // console.log('features', features)
  // console.log('tf', UniversalSentenceEncoder)
  // const model = await UniversalSentenceEncoder.load();
  // const featureTexts = results.map((feature) => feature.name);
  // const embeddings = await model.embed(featureTexts);
  
  return {
    props: {
      title: 'Living Documentation',
      // features,
      scenarios: scenariosWithEmbeddings,
    },
  }
}

export default function Docs(props: Props) {
  return <Page {...props} />
  // return (
  //   <div className={""}>
  //     <div className={""}>
  //       <h1>Living Documentation</h1>
  //       <YouTubeStyle>
  //             {props.results.map((feature) => (
  //               <Feature key={feature.id} feature={feature} />
  //             ))}
  //       </YouTubeStyle>
  //     </div>
  //   </div>
  // )
}

function Feature({ feature, setSelectedScenario }: { feature: Feature; setSelectedScenario: SetSelectedScenario; }): JSX.Element {

  // const videoPath = '../fixtures/videos/app.cy.ts.mp4';
  const featurePath = feature.uri.replace("cypress/e2e/", "");
  const videoPath = `/videos/${featurePath}.mp4`
  // const videoUrl = new URL(videoPath, import.meta.url)
  const videoUrl = new URL(videoPath, import.meta.url)
  console.log("videoUrl", videoUrl.pathname)

  return <div key={feature.id}>
    {/* <DescriptionCard /> */}
    <div>
      {/* <h2>{feature.name}</h2>
      <p>{feature.description}</p>
      <p>{feature.uri}</p> */}
      <ul className="space-y-4">
        {feature.elements.map((element) => (
          <li key={element.id} className="">
            <Scenario feature={feature} scenario={element} setSelectedScenario={setSelectedScenario} />
            {/* <h3>{element.name}</h3>
            <p>{element.description}</p>
            <ul>
              {element.steps.map((step) => (
                <li key={step.name}>
                  <strong>{step.keyword}</strong>
                  <span>{step.name} ({Math.floor(step.result.duration / 1000000)})</span>
                </li>
              ))}
            </ul> */}
          </li>
        ))}
      </ul>
      {/* <video width="320" height="240" controls>
        <source src={videoUrl.pathname} type="video/mp4" />
    </video> */}
    </div>
  </div>;
}

function Scenario({ feature, scenario, setSelectedScenario }: { feature: Feature; scenario: Element; setSelectedScenario?: SetSelectedScenario }): JSX.Element {
  const select = useCallback(() => {
    if (!setSelectedScenario) {
      return;
    }
    setSelectedScenario({
      featureId: feature.id,
      scenarioId: scenario.id,
     });
  }, [setSelectedScenario, feature.id, scenario.id]);
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {/* {feature.name} - {scenario.name} */}
          <div className="mt-1 flex text-sm text-gray-900 sm:col-span-11 sm:mt-0">
            <span className="flex-grow">
              {(scenario as any)?.similarity && (
                <span>
                ({((scenario as any).similarity * 100).toFixed(1)}%)
                {" "}
                </span>
              )}
              {feature.name} - {scenario.name}
              </span>
            {setSelectedScenario && (
              <span className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={select}
                >
                  {/* ({Math.floor(step.result.duration / 1000000)}) */}
                  View
                </button>
              </span>
            )}
          </div>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{feature.description}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {scenario.steps.map((step) => (
            <Step key={step.name} step={step} />
          ))}
        </dl>
      </div>
    </div>
  )
}

function Step({ step }: { step: Step }): JSX.Element {
  return (
    <div className="py-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500 w-auto text-right">{step.keyword}</dt>
      {/* <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Margot Foster</dd> */}
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-11 sm:mt-0">
        <span className="flex-grow">{step.name}</span>
        <span className="ml-4 flex-shrink-0">
          {/* <button
            type="button"
            className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ({Math.floor(step.result.duration / 1000000)})
            View
          </button> */}
        </span>
      </dd>
    </div>
  )
}

function DescriptionCard() {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-auto text-right">Full name</dt>
            {/* <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Margot Foster</dd> */}
            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-11 sm:mt-0">
              <span className="flex-grow">Margot Foster</span>
              <span className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          {/* 
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-36">Application for</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Backend Developer</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-36">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-36">Salary expectation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">$120,000</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-36">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
              qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
              pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 w-36">Attachments</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="ml-2 w-0 flex-1 truncate">resume_back_end_developer.pdf</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="ml-2 w-0 flex-1 truncate">coverletter_back_end_developer.pdf</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div> */}
        </dl>
      </div>
    </div>
  )
}

function YouTubeStyle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <aside>
        <VideoPlayer />
      </aside>
      <div className={"flex flex-1 items-stretch overflow-hidden"}>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SplitColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-1 items-stretch overflow-hidden"}>
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
    <DetailsSidebar />
  </div>
  )
}

function ScenarioVideoPlayer({ scenario, feature }: { scenario: Element, feature: Feature }) {
  // const videoPath = '/videos/app.cy.ts.mp4';
  // const videoPath = '/videos/duckduckgo.feature.mp4'
  const featurePath = feature.uri.replace("cypress/e2e/", "");
  const videoPath = `/videos/${featurePath}.mp4`

  const videoUrl = new URL(videoPath, import.meta.url)
  console.log("videoUrl", videoUrl.pathname)

  const width = "auto"; // "320"
  const height = "auto"; // "240"

  return (
    <video width={width} height={height} controls autoPlay>
      <source src={videoUrl.pathname} type="video/mp4" />
    </video>
  )
}

function VideoPlayer() {
  // const videoPath = '/videos/app.cy.ts.mp4';
  const videoPath = '/videos/duckduckgo.feature.mp4'
  const videoUrl = new URL(videoPath, import.meta.url)
  console.log("videoUrl", videoUrl.pathname)
  const width = "auto"; // "320"
  const height = "auto"; // "240"
  return (
    <video width={width} height={height} controls>
      <source src={videoUrl.pathname} type="video/mp4" />
    </video>
  )
}

function DetailsSidebar() {
  const currentFile = {
    name: 'IMG_4985.HEIC',
    size: '3.9 MB',
    source:
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    information: {
      'Uploaded by': 'Marie Culver',
      Created: 'June 8, 2020',
      'Last modified': 'June 8, 2020',
      Dimensions: '4032 x 3024',
      Resolution: '72 x 72',
    },
    sharedWith: [
      {
        id: 1,
        name: 'Aimee Douglas',
        imageUrl:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=1024&h=1024&q=80',
      },
      {
        id: 2,
        name: 'Andrea McMillan',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=oilqXxSqey&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  }
  
  // const videoPath = '/videos/app.cy.ts.mp4';
  const videoPath = '/videos/duckduckgo.feature.mp4'
  const videoUrl = new URL(videoPath, import.meta.url)
  console.log("videoUrl", videoUrl.pathname)

  return (
    <aside className="hidden w-8/12 overflow-y-auto border-l border-gray-200 bg-white p-8 lg:block">
      <div className="space-y-6 pb-16">
        <div>
          <div className="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg">
            {/* <img src={currentFile.source} alt="" className="object-cover" /> */}
            <video width="320" height="240" controls>
              <source src={videoUrl.pathname} type="video/mp4" />
            </video>
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                <span className="sr-only">Details for </span>
                {currentFile.name}
              </h2>
              <p className="text-sm font-medium text-gray-500">{currentFile.size}</p>
            </div>
            <button
              type="button"
              className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {/* <HeartIcon className="h-6 w-6" aria-hidden="true" /> */}
              <span className="sr-only">Favorite</span>
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Information</h3>
          <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
            {Object.keys(currentFile.information).map((key) => (
              <div key={key} className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">{key}</dt>
                <dd className="whitespace-nowrap text-gray-900">{currentFile.information[key]}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Description</h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm italic text-gray-500">Add a description to this image.</p>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {/* <PencilIcon className="h-5 w-5" aria-hidden="true" /> */}
              <span className="sr-only">Add description</span>
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Shared with</h3>
          <ul role="list" className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
            {currentFile.sharedWith.map((person) => (
              <li key={person.id} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <img src={person.imageUrl} alt="" className="h-8 w-8 rounded-full" />
                  <p className="ml-4 text-sm font-medium text-gray-900">{person.name}</p>
                </div>
                <button
                  type="button"
                  className="ml-6 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Remove<span className="sr-only"> {person.name}</span>
                </button>
              </li>
            ))}
            <li className="flex items-center justify-between py-2">
              <button
                type="button"
                className="group -ml-1 flex items-center rounded-md bg-white p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
                  {/* <PlusIconMini className="h-5 w-5" aria-hidden="true" /> */}
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                  Share
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div className="flex">
          <button
            type="button"
            className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Download
          </button>
          <button
            type="button"
            className="ml-3 flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </aside>

  )
}

interface Feature {
  description: string;
  elements: Element[];
  id: string;
  keyword: string;
  line: number;
  name: string;
  uri: string;
  tags?: Tag[];
};

// type Embedding = Tensor2D;
type Embedding = number[];
interface FeatureWithEmbeddings extends Feature {
  embedding: Embedding;
}

interface Element {
  description: string;
  id: string;
  keyword: string;
  line: number;
  name: string;
  before?: Before[];
  steps: Step[];
  type: string;
  tags?: Tag[];
};

interface Scenario extends Element {
}

interface ScenarioWithFeature extends Scenario {
  feature: Feature;
}

interface ScenarioWithEmbedding extends ScenarioWithFeature {
  embedding: Embedding;
}

type Before = {
  result: Result;
  match: Match;
};

type Result = {
  duration: number;
  status: string;
};

type Match = {
  location: string;
};

type Step = {
  keyword: string;
  line: number;
  name: string;
  result: Result;
  match: Match;
};

type Tag = {
  line: number;
  name: string;
};



const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Profile', href: '#', current: false },
  { name: 'Resources', href: '#', current: false },
  { name: 'Company Directory', href: '#', current: false },
  { name: 'Openings', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

// const widthClassName = "max-w-3xl lg:max-w-7xl"
const widthClassName = ""

type SelectedScenario = {
  featureId: string;
  scenarioId: string;
}

type SetSelectedScenario = Dispatch<SetStateAction<SelectedScenario>>;

let model: any;
async function embedSentences(sentences: string[]): Promise<Tensor2D> {
  if (!model) {
    const tf = (window as any).tf;
    const UniversalSentenceEncoder = (window as any).use;
    // const tf = await import('@tensorflow/tfjs')
    console.log('tf', tf)
    // const UniversalSentenceEncoder = await import('@tensorflow-models/universal-sentence-encoder');
    console.log('UniversalSentenceEncoder', UniversalSentenceEncoder)
    model = await UniversalSentenceEncoder.load();
  }
  return await model.embed(sentences);
}

export function Page(props: Props) {
  // const features: Feature[] = props.features;
  const allScenarios: ScenarioWithEmbedding[] = props.scenarios;
  
  // const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null)
  // const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState<SelectedScenario | null>(null)
  const [search, setSearch] = useState("");
  const [sortedScenarios, setSortedScenarios] = useState<ScenarioWithEmbedding[]>([])
  const scenarios = (search.trim() && sortedScenarios.length > 0) ? sortedScenarios : allScenarios;

  useEffect(() => {
    async function run() {
      if (!search.trim()) {
        return;
      }
      const tf = (window as any).tf;
      /*
      const UniversalSentenceEncoder = (window as any).use;
      // const tf = await import('@tensorflow/tfjs')
      console.log('tf', tf)
      // const UniversalSentenceEncoder = await import('@tensorflow-models/universal-sentence-encoder');
      console.log('UniversalSentenceEncoder', UniversalSentenceEncoder)
      const model = await UniversalSentenceEncoder.load();
      */

      /*
      // Embed an array of sentences.
      const sentences = [
        // 'Hello.',
        // 'How are you?',
        // 'Hey.',
        // 'Given user is signed up with US persona account',
        // 'Given user is signed up with Canada personal account',
        // 'Given user is signed up with a fake account',
        'Given I click the button',
        'Given I opened Facebook',
        'Given I visited Google',
        'Given I am on Twitter',
        'Given I like pizza',
        'Given I enjoy cake',
      ];
      // const embeddings = await model.embed(sentences);
      const embeddings = await embedSentences(sentences)
      // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
      // So in this example `embeddings` has the shape [2, 512].
      // embeddings.print(true); // verbose
      const arr = embeddings.arraySync();
      console.log('embeddings', arr)

      // const a = tf.tensor1d(arr[0]);
      // const b = tf.tensor1d(arr[1]);
      // const c = tf.tensor1d(arr[2]);
      // const cosine1 = tf.losses.cosineDistance(a, b)
      // const cosine2 = tf.losses.cosineDistance(a, c)
      // console.log('a-b', cosine1.dataSync()[0])
      // console.log('a-c', cosine2.dataSync()[0])

      // Loop over sentences and print their cosine similarity to every other sentence.
      for (let i = 0; i < sentences.length; i++) {
        for (let j = 0; j < sentences.length; j++) {
          if (i === j) continue;
          const a = tf.tensor1d(arr[i]);
          const b = tf.tensor1d(arr[j]);
          const cosine = tf.losses.cosineDistance(a, b)
          console.log(`Similarity(${sentences[i]}, ${sentences[j]}):`, cosine.dataSync()[0]);
        }
      }
      */

      // // const featureTexts = features.map((feature) => feature.name);
      // // const embeddings = await model.embed(featureTexts);
      // const sentences = [
      //   "duckduckgo",
      // ];
      // const embeddings = await model.embed(sentences);
      // console.log('embeddings', embeddings)


      const embeddings = await embedSentences([search]);
      console.log('embeddings', search, embeddings)
      // Search bar
      const searchEmbedding = embeddings.arraySync()[0];

      const scenarioSimilarities = scenarios.map((scenario) => {
        const scenarioEmbedding = scenario.embedding;
        // const a = tf.tensor1d(searchEmbedding);
        // const b = tf.tensor1d(scenarioEmbedding);
        // const cosine = tf.losses.cosineDistance(a, b);
        // const similarity = cosine.dataSync()[0];
        const s = similarity(searchEmbedding, scenarioEmbedding)
        return {
          ...scenario,
          similarity: s,
        };
      });
      // console.log('scenarioSimilarities', scenarioSimilarities)

      const sortedScenarios = scenarioSimilarities.sort((a, b) => {
        // if (a.similarity == false || b.similarity == false) {
        // Check if boolean
        if (typeof a.similarity !== 'number' || typeof b.similarity !== 'number') {
          return 0;
        }
        return b.similarity - a.similarity;
      });
      // const sortedScenarios = scenarioSimilarities.sort((a, b) => a.similarity - b.similarity);
      console.log('sortedScenarios', sortedScenarios);
      setSortedScenarios(sortedScenarios);

    }
    run();
  }, [search])

  const { scenario, feature } = useMemo(() => {
    if (!selectedScenario) {
      return {
        feature: null,
        scenario: null,
      }
    }

    // const feature = features.find((f) => f.id === selectedScenario.featureId)
    // const scenario = feature?.elements.find((e) => e.id === selectedScenario.scenarioId)

    const scenario = scenarios.find((s) => s.id === selectedScenario.scenarioId && s.feature.id === selectedScenario.featureId)
    const feature = scenario.feature;

    return {
      feature,
      scenario,
    };
  }, [selectedScenario])

  console.log("selectedScenario", { selectedScenario, feature, scenario })

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" strategy='beforeInteractive' />
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder" strategy='beforeInteractive' />

      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Popover as="header" className="bg-indigo-600 pb-24">
          {({ open }) => (
            <>
              <div className={classNames("mx-auto px-4 sm:px-6 lg:px-8", widthClassName)}>
                <div className="relative flex items-center justify-center py-5 lg:justify-between">
                  {/* Logo */}
                  <div className="absolute left-0 flex-shrink-0 lg:static">
                    <a href="#">
                      <span className="sr-only">Your Company</span>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                        alt="Your Company"
                      />
                    </a>
                  </div>

                  {/* Right section on desktop */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                    <button
                      type="button"
                      className="flex-shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>

                  {/* Search */}
                  <div className="min-w-0 flex-1 px-12 lg:hidden">
                    <div className="mx-auto w-full max-w-xs">
                      <label htmlFor="desktop-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-white focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="desktop-search"
                          className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                          placeholder="Search"
                          type="search"
                          name="search"
                          onChange={(e) => {
                            setSearch(e.target.value)
                          }}
                          value={search}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menu button */}
                  <div className="absolute right-0 flex-shrink-0 lg:hidden">
                    {/* Mobile menu button */}
                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden border-t border-white border-opacity-20 py-5 lg:block">
                  {/* <div className="grid grid-cols-3 items-center gap-8">
                    <div className="col-span-1">
                      <nav className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-100',
                              'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="col-span-2"> */}
                      {/* <div className="mx-auto w-full max-w-md"> */}
                      <div className="mx-auto w-full">
                        <label htmlFor="mobile-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <input
                            id="mobile-search"
                            className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                            placeholder="Search"
                            type="search"
                            name="search"
                            onChange={(e) => {
                              setSearch(e.target.value)
                            }}
                            value={search}  
                          />
                        </div>
                      {/* </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                    >
                      <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="pt-3 pb-2">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt="Your Company"
                              />
                            </div>
                            <div className="-mr-2">
                              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </Popover.Button>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1 px-2">
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Home
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Profile
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Resources
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Company Directory
                            </a>
                            <a
                              href="#"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                            >
                              Openings
                            </a>
                          </div>
                        </div>
                        <div className="pt-4 pb-2">
                          <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                              <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                              <div className="truncate text-base font-medium text-gray-800">{user.name}</div>
                              <div className="truncate text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                            <button
                              type="button"
                              className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">View notifications</span>
                              <BellIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </>
          )}
        </Popover>
        <main className="-mt-24 pb-8">
          <div className={classNames("mx-auto px-4 sm:px-6 lg:px-8", widthClassName)}>
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            {feature && scenario && (
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 className="sr-only" id="section-1-title">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <ScenarioVideoPlayer scenario={scenario} feature={feature} />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 className="sr-only" id="section-2-title">
                    Section title
                  </h2>
                  <Scenario scenario={scenario} feature={feature} />
                  {/* <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                    <pre>{`
@feature-tag
Feature: The Facebook page

I want to open a social network page

@tag-to-include
Scenario: Opening a social network page
  Given I open Facebook page
  Then I see "Facebook" in the title
                    `}
                    </pre>
                    </div>
                  </div> */}
                </section>
              </div>
            </div>
            )}
{/*             
            <section aria-labelledby="section-3-title">
              <h2 className="sr-only" id="section-3-title">
                Section title
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow"> */}
                <div className="p-6 space-y-4">
                  {/*
                  {features.map((feature) => (
                    <Feature key={feature.id} feature={feature} setSelectedScenario={setSelectedScenario} />
                  ))}
                  */}
                  {scenarios.map((scenario) => (
                    <Scenario key={scenario.id} scenario={scenario} feature={scenario.feature} setSelectedScenario={setSelectedScenario} />
                  ))}
                </div>
              {/* </div>
            </section> */}

          </div>
        </main>
        <footer>
          <div className={classNames("mx-auto px-4 sm:px-6 lg:px-8", widthClassName)}>
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
              <span className="block sm:inline">&copy; 2021 Your Company, Inc.</span>{' '}
              <span className="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
