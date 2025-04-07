// Example of defining a research project with enhanced visualizations
// This demonstrates how to use both image and HTML visualizations in a project

import { 
  createD3Visualization, 
  createChartJsVisualization,
  createIframeEmbed,
  createCustomHtmlVisualization,
  imageToVisualization
} from '../utils/visualizationHelpers';

// Example project with visualizations
const exampleResearchProject = {
  id: "data-visualization-research",
  title: "Data Visualization Research Project",
  description: "Research on advanced data visualization techniques for scientific data",
  fullDescription: `This research project explores innovative approaches to visualizing complex scientific 
  datasets using a combination of traditional and interactive visualization techniques. Our work focuses on 
  making complex data more accessible and understandable through visual representation.`,
  
  tags: ["Data Science", "Research", "Visualization"],
  technicalTags: ["D3.js", "Chart.js", "WebGL", "Python"],
  
  // Legacy images (can still be included for backward compatibility)
  images: [
    {
      url: "/images/research/visualization-example1.jpg", 
      caption: "Static visualization of climate data"
    }
  ],
  
  // New enhanced visualizations - mix of images and HTML
  visualizations: [
    // Regular image visualization
    {
      type: "image",
      url: "/images/research/visualization-example1.jpg", 
      caption: "Static visualization of climate data trends over 50 years"
    },
    
    // D3.js interactive visualization
    createD3Visualization(
      "Interactive D3.js bar chart showing research metrics",
      `
        <div id="chart"></div>
        <script>
          // Sample data
          const data = [
            {name: "Metric A", value: 45},
            {name: "Metric B", value: 67},
            {name: "Metric C", value: 32},
            {name: "Metric D", value: 89},
            {name: "Metric E", value: 54}
          ];
          
          // Set dimensions and margins
          const margin = {top: 20, right: 30, bottom: 40, left: 40};
          const width = 450 - margin.left - margin.right;
          const height = 250 - margin.top - margin.bottom;
          
          // Create SVG
          const svg = d3.select("#chart")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
          // X axis
          const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.name))
            .padding(0.2);
            
          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("transform", "rotate(-45)");
          
          // Y axis
          const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
            
          svg.append("g")
            .call(d3.axisLeft(y));
          
          // Bars
          svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
              .attr("x", d => x(d.name))
              .attr("y", d => y(d.value))
              .attr("width", x.bandwidth())
              .attr("height", d => height - y(d.value))
              .attr("fill", "#3498db")
              .on("mouseover", function() {
                d3.select(this).attr("fill", "#2980b9");
              })
              .on("mouseout", function() {
                d3.select(this).attr("fill", "#3498db");
              });
        </script>
      `,
      "300px"
    ),
    
    // Chart.js visualization
    createChartJsVisualization(
      "Chart.js line graph of research findings",
      `{
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          }, {
            label: 'Dataset 2',
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Research Findings Over Time'
            }
          }
        }
      }`,
      "300px"
    ),
    
    // Iframe embed (can be used for embedding external tools, dashboards, etc.)
    createIframeEmbed(
      "Interactive map visualization from external source",
      "https://example.com/interactive-map",
      "400px"
    ),
    
    // Custom HTML visualization (for more advanced cases)
    createCustomHtmlVisualization(
      "Custom HTML visualization with CSS animations",
      `
        <div class="container">
          <h3>Interactive Data Points</h3>
          <div class="data-points">
            <div class="point" data-value="78">Point A</div>
            <div class="point" data-value="45">Point B</div>
            <div class="point" data-value="90">Point C</div>
          </div>
        </div>
        
        <style>
          .container {
            padding: 20px;
            text-align: center;
          }
          .data-points {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
          }
          .point {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #3498db;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease, background-color 0.3s ease;
          }
          .point:hover {
            transform: scale(1.1);
            background-color: #2980b9;
          }
          .point::after {
            content: attr(data-value) + '%';
            position: absolute;
            top: 100%;
            margin-top: 10px;
            color: #333;
            font-size: 14px;
          }
        </style>
      `,
      true,
      "200px"
    )
  ],
  
  keyTakeaways: [
    "Interactive visualizations increase user engagement with scientific data by 40%",
    "Combined use of static and interactive elements provides the most comprehensive understanding of complex datasets",
    "Web-based visualization tools enable wider dissemination of research findings",
    "Custom visualizations tailored to specific data types yield better insights than generic approaches"
  ],
  
  links: [
    { 
      title: "Research Publication", 
      url: "https://example.com/research-paper" 
    },
    { 
      title: "Interactive Demo Dashboard", 
      url: "https://example.com/demo" 
    },
    { 
      title: "Data Repository", 
      url: "https://github.com/example/data-repo" 
    }
  ],
  
  collaborators: [
    "Dr. Jane Smith, Lead Researcher",
    "John Doe, Data Scientist",
    "Alex Johnson, Visualization Expert"
  ]
};

export default exampleResearchProject;

/*
HOW TO USE:

1. Import this example in your projects data file:
   
   import dataVisualizationExample from '../examples/visualization-example';

2. Include it in your projects data:

   const projects = {
     research: {
       "data-visualization-research": dataVisualizationExample,
       // other projects...
     },
     // other project types...
   };

3. The ResearchProjectInfo component will automatically handle both types of visualizations
*/ 