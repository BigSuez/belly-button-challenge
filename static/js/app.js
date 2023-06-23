//Set Target URL and read in Data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let samples = [];
let metadata = [];

d3.json(url).then(function(data){
    //Set Names and Samples
    samples = data.samples;
    metadata = data.metadata;
    let names = data.names;

    //Add Subject IDs to Dropdown
    for (i=0; i< names.length; i++){
        d3.select('select').append('option').text(names[i]).property('value', i);
    };
});

function optionChanged(id){
    let subject = samples[id];
    let ids = subject.otu_ids;
    let vals = subject.sample_values;
    let labels = subject.otu_labels;

    makeBar(ids.slice(0,10), vals.slice(0,10), labels.slice(0, 10));
    makeBubble(ids, vals, labels);
    makeInfo(metadata[id]);
    makeGauge(metadata[id].wfreq)
};

//Create Bar Chart
function makeBar(ids, vals, labels){
    let trace1 = {
        x: vals,
        y: toString(ids),
        type: 'bar',
        orientation: 'h',
        hovertext: labels
    }

    let layout = {
        yaxis: {
            tickmode: 'array',
            tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            ticktext: ids.map(id => `OTU ${id}`)
        }
    }
    let data = [trace1];
    Plotly.newPlot("bar", data, layout);
};

//Create Bubble Chart
function makeBubble(ids, vals, labels){
    let trace1 = {
        x: ids,
        y: vals,
        mode: 'markers',
        marker: {
            size: vals.map(val => val/2),
            color: ids
        },
        text: labels
    };
    let data = [trace1];
    Plotly.newPlot('bubble', data)
};

//Populate Demographic Info
function makeInfo(subject){
    dataBox = d3.select('#sample-metadata');
    dataBox.html('');
    dataBox.append('li').text(`ID: ${subject.id}`);
    dataBox.append('li').text(`Ethnicity: ${subject.ethnicity}`);
    dataBox.append('li').text(`Gender: ${subject.gender}`);
    dataBox.append('li').text(`Age: ${subject.age}`);
    dataBox.append('li').text(`Location: ${subject.location}`);
    dataBox.append('li').text(`Bellybutton Type: ${subject.bbtype}`);
    dataBox.append('li').text(`Wash Frequency: ${subject.wfreq}`);
}

//Make Guage
function makeGauge(wfreq){
    let trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
		value: wfreq,
		title: { text: "Weekly Belly Button Washes" },
		type: "indicator",
		mode: "gauge+number",
        gauge: {
            axis: {range: [0, 10]},
            steps: [
                {range: [0,1], color: '#ff0000'},
                {range: [1,2], color: '#fd4400'},
                {range: [2,3], color: '#f76500'},
                {range: [3,4], color: '#ec8000'},
                {range: [4,5], color: '#de9900'},
                {range: [5,6], color: '#ccaf00'},
                {range: [6,7], color: '#b6c400'},
                {range: [7,8], color: '#9ad700'},
                {range: [8,9], color: '#74e900'},
                {range: [9,10], color: '#29fa00'},
            ],
            bar: {color: 'blue'}
        }
    }
    let data = [trace1]
    Plotly.newPlot('gauge', data)
}