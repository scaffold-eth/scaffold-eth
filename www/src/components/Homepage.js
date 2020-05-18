import styled from '@emotion/styled';
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import CodeBlock from './CodeBlock';
import SEO from './seo';

const Hero = styled.div`
  position: relative;
  background: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(26, 20, 74, 1) 0%,
    rgba(59, 52, 120, 1) 100.2%
  );
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const HeroSvg = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  min-width: 800px;
`;

const components = {
  code: CodeBlock
};

const Homepage = ({ children }) => {
  return (
    <MDXProvider components={components}>
      <div className="antialiased">
        <SEO title="Scaffold ETH" />
        <Hero className="px-6 pt-12 pb-48">
          <div className="md:mt-6 lg:mt-12 text-center text-white">
            <h1 className="text-4xl leading-10 font-bold sm:text-5xl sm:leading-none md:text-6xl">
              🏗 Scaffold ETH
            </h1>
            <p className="text-xl md:text-3xl mt-4">
              Everything you need to prototype and build a decentralized application
            </p>
            <p className="mt-10 lg:mt-16">
              <a
                href="https://github.com/austintgriffith/scaffold-eth"
                target="blank"
                className="w-full block md:w-auto md:inline-block mb-6 bg-transparent hover:bg-purple-600 text-gray-300 font-semibold py-3 px-6 md:mx-2 border border-gray-300 hover:border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Visit On GitHub
              </a>
            </p>
          </div>
          {/* <div className="hero-video mt-8 max-w-screen-lg mx-auto">
          <div className="relative aspect-16x9">
            <iframe
              className="absolute pin"
              title="Scaffold ETH Speedrun"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/eUAc2FtC0_s"
              frameBorder="0"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div> */}
          <HeroSvg>
            <svg viewBox="0 0 1695 57" preserveAspectRatio="none">
              <path
                d="M0 23c135.4 19 289.6 28.5 462.5 28.5C721.9 51.5 936.7 1 1212.2 1 1395.8.9 1556.7 8.3 1695 23v34H0V23z"
                fill="rgba(255,255,255,1)"
                fillRule="evenodd"
              />
            </svg>
          </HeroSvg>
        </Hero>

        <div className="container mx-auto mt-12 mb-12 sm:mt-16 md:mt-32 px-6 sm:px-6 lg:px-8">
          {children}
        </div>

        {/* <div className="container mx-auto mt-12 mb-12 sm:mt-16 md:mt-32 px-6 sm:px-6 lg:px-8">
        <h2 className="text-center leading-10 font-semibold text-3xl mt-16 text-gray-900">
          Forkable Ethereum Dev Stack Focused on Fast Product Iteration
        </h2>
        <div className="mt-16">
          <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
            <li>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-700 text-white">
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg leading-6 font-medium text-gray-900">
                    Made for fast prototyping
                  </h5>
                  <p className="mt-2 text-base leading-6 text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Maiores impedit perferendis suscipit eaque, iste dolor
                    cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-700 text-white">
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg leading-6 font-medium text-gray-900">
                    Headline
                  </h5>
                  <p className="mt-2 text-base leading-6 text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Maiores impedit perferendis suscipit eaque, iste dolor
                    cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-700 text-white">
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-6">
                  <h5 className="text-lg leading-6 font-medium text-gray-900">
                    Headline
                  </h5>
                  <p className="mt-2 text-base leading-6 text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Maiores impedit perferendis suscipit eaque, iste dolor
                    cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-700 text-white">
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg leading-6 font-medium text-gray-900">
                    Headline
                  </h5>
                  <p className="mt-2 text-base leading-6 text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Maiores impedit perferendis suscipit eaque, iste dolor
                    cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div> */}
      </div>
    </MDXProvider>
  );
};

export default Homepage;
