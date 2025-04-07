import { Visualization } from './projectData';

/**
 * Creates a D3.js visualization
 * @param caption Caption for the visualization
 * @param htmlContent D3 HTML and JavaScript code
 * @param height Optional height for the visualization
 * @param width Optional width for the visualization
 * @returns A Visualization object with type 'html'
 */
export const createD3Visualization = (
  caption: string,
  htmlContent: string,
  height?: string,
  width?: string
): Visualization => {
  // Wrap the D3 code with necessary imports
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        svg {
          display: block;
          margin: 0 auto;
        }
        .tooltip {
          position: absolute;
          padding: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border-radius: 4px;
          pointer-events: none;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  return {
    type: 'html',
    caption,
    htmlContent: wrappedHtml,
    height,
    width
  };
};

/**
 * Creates a Chart.js visualization
 * @param caption Caption for the visualization
 * @param chartConfig Chart.js configuration object as a string
 * @param height Optional height for the visualization
 * @param width Optional width for the visualization
 * @returns A Visualization object with type 'html'
 */
export const createChartJsVisualization = (
  caption: string,
  chartConfig: string,
  height?: string,
  width?: string
): Visualization => {
  // Create a Chart.js canvas with the provided config
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        canvas {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <div style="width: 100%; height: 100%;">
        <canvas id="chart"></canvas>
      </div>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const ctx = document.getElementById('chart').getContext('2d');
          const chartConfig = ${chartConfig};
          new Chart(ctx, chartConfig);
        });
      </script>
    </body>
    </html>
  `;

  return {
    type: 'html',
    caption,
    htmlContent: wrappedHtml,
    height,
    width
  };
};

/**
 * Creates an embedded interactive iframe
 * @param caption Caption for the iframe
 * @param url URL of the content to embed
 * @param height Optional height for the iframe
 * @param width Optional width for the iframe
 * @returns A Visualization object with type 'html'
 */
export const createIframeEmbed = (
  caption: string,
  url: string,
  height?: string,
  width?: string
): Visualization => {
  const wrappedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body, html, iframe {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          border: none;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <iframe src="${url}" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
      </iframe>
    </body>
    </html>
  `;

  return {
    type: 'html',
    caption,
    htmlContent: wrappedHtml,
    height,
    width
  };
};

/**
 * Creates a general custom HTML visualization
 * @param caption Caption for the visualization
 * @param htmlContent Raw HTML content
 * @param includeDefaultStyles Whether to include some default styling
 * @param height Optional height for the visualization
 * @param width Optional width for the visualization
 * @returns A Visualization object with type 'html'
 */
export const createCustomHtmlVisualization = (
  caption: string,
  htmlContent: string,
  includeDefaultStyles: boolean = true,
  height?: string,
  width?: string
): Visualization => {
  let wrappedHtml = htmlContent;
  
  if (includeDefaultStyles) {
    wrappedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.5;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }

  return {
    type: 'html',
    caption,
    htmlContent: wrappedHtml,
    height,
    width
  };
};

/**
 * Converts a traditional ProjectImage to a Visualization
 * @param image The ProjectImage object to convert
 * @returns A Visualization object with type 'image'
 */
export const imageToVisualization = (image: { url: string, caption: string }): Visualization => {
  return {
    type: 'image',
    caption: image.caption,
    url: image.url
  };
}; 