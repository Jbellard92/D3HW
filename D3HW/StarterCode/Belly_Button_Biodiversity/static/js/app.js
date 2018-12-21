function buildMetadata(sample) {
  
  console.log("Inside Build Metadata");
  
  d3.json(`/metadata/${sample}`).then(function(d) {
    console.log(d);

    mData = Object.entries(d);

    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    
    console.log(mData);
    console.log(PANEL);
    PANEL.selectAll("h6").data(mData).enter().append("h6")
    .text(function(d) {return `${d[0]}: ${d[1]}` ; });
    // Could not get the below forEachloop to append the metadata
    // Object.entries(d).forEach(([key,value]) => {
    //   PANEL.append("h6").text(`${key}: ${value}`);
    // });
  })
};

function buildCharts(sample) {
console.log("Inside Build Chart")

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  // var labels = sample[0]['#selDataset'].map(function(item) {
  //     return otuData[item]
  // });
  var sample = d3.select("#selDataset").property("value");
  d3.json(`/samples/${sample}`).then((d) => {
    var otu_labels = d.otu_labels;
    var sample = d.sample;

    // Build Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }
    };
    var bubbleData = [{
      x: sample[0]['otu_ids'],
      y: sample[0]['sample_values'],
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample[0]['sample_values'],
          color: sample[0]['otu_ids'],
          colorscale: "Earth",
      }
  }
];

  var Bubble = document.getElementById('bubble');
  Plotly.plot(Bubble, bubbleData, bubbleLayout);

  // Build Pie Chart
  console.log(sample[0]['sample_values'].slice(0, 10))
  var pieData = [{
      values: sample[0]['sample_values'].slice(0, 10),
      labels: sample[0]['otu_ids'].slice(0, 10),
      hovertext: labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
  }];
    var pieLayout = {
      margin: { t: 0, l: 0 }
  };

  var pie = document.getElementById('pie');
  Plotly.plot(pie, pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  console.log("Inside INIT") 
  
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init()
