var selected_value = 50;
var selector = document.getElementById("selected");
var info = document.getElementById("topInfo");
var topLikes = 0, averageLikes;
var friendNum = 1;
var highestReaction = 0;
var highestReactionType;
var globalLikes = [], globalComment = [], globalShare = [], globalTime = [];
var globalLove = [], globalHaha = [], globalWow = [], globalSad = [], globalAngry = [];

var allReactChart;
var totalChart;

selector.addEventListener('change', function () {
    if (selected_value != selector[selector.selectedIndex].value) {
        selected_value = selector[selector.selectedIndex].value
    }

    if(checkbox_All.checked){
        allReactChart.destroy();
        plotAll("chart", globalLikes, globalComment, globalShare, globalTime)
        showLikeInsight();    
    }
    else if(checkbox_Tot.checked){
        totalChart.destroy();
        plotTotal("chart",globalLove,globalHaha,globalWow,globalSad,globalAngry,globalTime);
        showReactionInsight();
    }

});

function hideInsight() {
    info.style.display = 'none';
}

function showInsight() {
    info.style.display = 'inherit';

}

var triggerMessage = document.getElementById("triggerMessage");
var chartInfo = document.getElementById("chartInfo");

function showInfo(message){
    triggerMessage.setAttribute("style","height:100px");
    triggerMessage.style.height = '70px';
    chartInfo.innerHTML = message;
}

function hideInfo() {
    chartInfo.innerHTML = "";
    triggerMessage.setAttribute("style","height:50px");
    triggerMessage.style.height = '50px';
}

var checkbox_All = document.getElementById("togAllBtn");
var checkbox_Tot = document.getElementById("togTotBtn");
var checkbox_Type = document.getElementById("togTypBtn");

function showLikeInsight(){
    var interactionRate = ((topLikes/friendNum)*100).toFixed(0);
    if(interactionRate > 20){
        info.innerHTML = "The highest number of likes you have gotten is " + topLikes + "! " + interactionRate + "% of your friends interacted with you! Well Done!";
    } else {
        info.innerHTML = "The highest number of likes you have gotten is " + topLikes + "! Only " + interactionRate + "% of your friends interacted with you. Please keep it up!";
    }
}

function showReactionInsight(){
    info.innerHTML = "As an overall, your friends frequently interact with your posts with " + highestReactionType + " reaction! The number goes as high as " + highestReaction + "!";
}

checkbox_All.addEventListener('change', function () {
    if (this.checked) {
        showInfo("This line graph shows the number of Likes, Comments and Shares of each post against the posted date.");
        showInsight();
        showLikeInsight();
    } else if (!this.checked) {
        hideInfo();
        hideInsight();
    }
});

checkbox_Tot.addEventListener('change', function () {
    if (this.checked) {
        showInfo("This bar graph shows the total number of Reactions such as Wow, Sad, Angry reaction of each post against the posted date.");
        showInsight();
        showReactionInsight();
    } else if (!this.checked) {
        hideInfo();
        hideInsight();
    }
});

checkbox_Type.addEventListener('change', function () {
    if (this.checked) {
        showInfo("This pie chart shows the accumulated different types of post, up to 50 posts, created by you.");
        // showselect();
    } else if (!this.checked) {
        hideInfo();
        hideselect();
    }
});



Chart.defaults.global.defaultFontColor = 'white';


function plotAll(chartid, newLikes, newComment, newShare, newTime) {

    globalLikes = newLikes.slice(0, newLikes.length);
    globalComment = newComment.slice(0, newComment.length);
    globalShare = newShare.slice(0, newShare.length);
    globalTime = newTime.slice(0, newTime.length);
       
    var tempLikes = [], tempComment = [], tempShare = [], tempTime = [], tempTopLikes = [];

    var k = selected_value-1;
    for (i = globalLikes.length-1; i >= (globalLikes.length-1)-selected_value; i--) {
        tempLikes[k] = newLikes[i];
        tempComment[k] = newComment[i];
        tempShare[k] = newShare[i];
        tempTime[k] = newTime[i].slice(0, 10);
        tempTopLikes[k] = newLikes[i];
        if(tempTopLikes[k] > topLikes){
            topLikes = tempTopLikes[k];
        }
        averageLikes += newLikes[i];
        k--;
    }

    if (checkbox_All.checked) {
        if (checkbox_Tot.checked) {
            totalChart.destroy();
            checkbox_Tot.checked = false;
        }
        if (checkbox_Type.checked) {
            typeChart.destroy();
            checkbox_Type.checked = false;
        }

        var ctx = document.getElementById(chartid).getContext('2d');
        allReactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tempTime,
                datasets: [
                    {
                        label: 'Likes',
                        fill: false,
                        //lineTension: 0.5,
                        data: tempLikes,
                        backgroundColor: 'rgba(72,61,139, 0.2)',
                        borderColor: 'rgba(72,61,139, 1)',
                        borderWidth: 3
                    },
                    {
                        label: 'Comment',
                        data: tempComment,
                        backgroundColor: 'rgba(255,140,0, 0.2)',
                        borderColor: 'rgba(255,140,0, 1)',
                        borderWidth: 3
                    },
                    {
                        label: 'Share',
                        data: tempShare,
                        backgroundColor: 'rgba(178,34,34, 0.2)',
                        borderColor: 'rgba(178,34,34,1)',
                        borderWidth: 3
                    }]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255,0.5)',
                            lineWidth: 2
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255,0.5)',
                            lineWidth: 2
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    else if (!checkbox_All.checked) {
        allReactChart.destroy();
    }
}

function countReaction(love, haha, wow, sad, angry){
    var lovecount=0, hahacount=0, wowcount=0, sadcount =0, angrycount =0;
    for (i = love.length-1; i >= (love.length-1)-selected_value; i--) {
        lovecount += love[i];
        hahacount+= haha[i];
        wowcount += wow[i];
        sadcount += sad[i];
        angrycount += angry[i];
    }

    var obj = {
        Love : lovecount, Haha : hahacount, Wow : wowcount, Sad : sadcount, Angry : angrycount
    };

    highestReaction = Math.max(lovecount,hahacount,wowcount,sadcount,angrycount);

    var keys = Object.keys(obj);
    var max = keys[0];
    for (var i = 1, n = keys.length; i < n; ++i) {
       var k = keys[i];
       if (obj[k] > obj[max]) {
          max = k;
       }
    }
    return max;
}

function plotTotal(chartid, newLove, newHaha, newWow, newSad, newAngry, newTime) {

    highestReactionType =  countReaction(newLove, newHaha, newWow, newSad, newAngry);

    globalLove = newLove.slice(0, newLove.length);
    globalHaha = newHaha.slice(0, newHaha.length);
    globalWow = newWow.slice(0, newWow.length);
    globalSad = newSad.slice(0, newSad.length);
    globalAngry = newAngry.slice(0, newAngry.length);
    globalTime = newTime.slice(0, newTime.length);

    var tempLove = [], tempHaha = [], tempWow = [], tempSad = [], tempAngry = [], tempTime = [];
    var k = selected_value-1;
    console.log("there");
    console.log(k);
    console.log(newLove.length);
    for (i = newLove.length-1; i >= (newLove.length-1)-selected_value; i--) {
        console.log("here1");
        tempLove[k] = newLove[i];
        tempHaha[k] = newHaha[i];
        tempWow[k] = newWow[i];
        tempSad[k] = newSad[i];
        tempAngry[k] = newAngry[i];
        tempTime[k] = newTime[i].slice(0, 10);
        k--;
    }

    if (checkbox_Tot.checked) {
        if (checkbox_All.checked) {
            allReactChart.destroy();
            checkbox_All.checked = false;
        }

        if (checkbox_Type.checked) {
            typeChart.destroy();
            checkbox_Type.checked = false;
        }

        var ctx = document.getElementById(chartid).getContext('2d');
        totalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tempTime,
                datasets: [{
                    label: 'Love',
                    fill: true,
                    backgroundColor: 'rgba(128,0,0, 0.8)',
                    borderColor: 'rgba(128,0,0, 1)',
                    data: tempLove,
                }, {
                    label: 'Haha',
                    backgroundColor: 'rgba(255,165,0, 0.8)',
                    borderColor: 'rgba(255,165,0, 1)',
                    data: tempHaha,
                    fill: true,

                }, {
                    label: 'Wow',
                    backgroundColor: 'rgba(46,139,87, 0.8)',
                    borderColor: 'rgba(46,139,87, 1)',
                    data: tempWow,
                    fill: true,
                }, {
                    label: 'Sad',
                    backgroundColor: 'rgba(153,50,204, 0.8)',
                    borderColor: 'rgba(153,50,204, 0.8)',
                    data: tempSad,
                    fill: true,
                }, {
                    label: 'Angry',
                    backgroundColor: 'rgba(112,128,144, 0.8)',
                    borderColor: 'rgba(112,128,144, 1.0)',
                    data: tempAngry,
                    fill: true,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255,0.5)',
                            lineWidth: 2
                        },
                        stacked: true
                    }],

                    yAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255,0.5)',
                            lineWidth: 2
                        },
                        stacked: true
                    }],
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
        console.log("end1");
    }
    else if (!checkbox_Tot.checked) {
        totalChart.destroy();
    }
}

var typeChart;
function plotType(chartid, postCount, postType){

    if(checkbox_Type.checked){

        if (checkbox_All.checked) {
            allReactChart.destroy();
            checkbox_All.checked = false;
        }
        if (checkbox_Tot.checked) {
            totalChart.destroy();
            checkbox_Tot.checked = false;
        }

        var ctx = document.getElementById(chartid).getContext('2d');
        typeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: postCount,
                    backgroundColor: ["Red","Green","Blue","Yellow","Purple","Pink"],
                    hoverBackgroundColor: ["Red","Green","Blue","Yellow","Purple","Pink"],
                    hoverBorderColor: "Black",
                }],
            
                labels:
                    postType
                
            },
            options:{
                segmentShowStroke : true,
                segmentStrokeWidth : 2,
                cutoutPercentage : 60,
                animationSteps : 100,
                animationEasing : "easeOutBounce",
                animateRotate : true,
                animateScale : true,
                responsive: true,
                maintainAspectRatio: true,
                showScale: true,
                animateScale: true
            }
        });
    } else if(!checkbox_Type.checked){
        typeChart.destroy();
    }
}

function friendNumber(x) {
    friendNum = x;
}

// var postTypeChart;
// function plotPostType(chartid, newType, newTime){

//     var tempTime = [];
//     var totLink18 = 0, totStatus18 = 0, totalPhoto18 = 0, totalVideo18 = 0, totalOffer18 = 0;
//     var totLink17 = 0, totStatus17 = 0, totalPhoto17 = 0, totalVideo17 = 0, totalOffer17 = 0;

//     for (i = 0; i < newType.length; i++) {
//         tempTime[i] = newTime[i].slice(0, 4);

//         if(tempTime = "2018"){
//             if(newType[i] == "link"){
//                 totLink18 += 1;
//                 console.log(totLink18);
//             }
//             else if(newType[i] == "status"){
//                 totStatus18 += 1;
//             }
//             else if(newType[i] == "photo"){
//                 totalPhoto18 += 1; 
//             }
//             else if(newType[i] == "video"){
//                 totalVideo18 += 1;
//             }
//             else if(newType[i] == "offer"){
//                 totalOffer18 +=1;
//             }
//         }
//         else{
//             if(newType[i] == "link"){
//                 totLink17 += 1;
//             }
//             else if(newType[i] == "status"){
//                 totStatus17 += 1;
//             }
//             else if(newType[i] == "photo"){
//                 totalPhoto17 += 1; 
//             }
//             else if(newType[i] == "video"){
//                 totalVideo17 += 1;
//             }
//             else if(newType[i] == "offer"){
//                 totalOffer17 +=1;
//             }
//         }
//         if (checkbox_Type.checked) {
//             typeChart.destroy();
//             checkbox_Type.checked = false;
//         }

        
//     }

//     var ctx = document.getElementById(chartid).getContext('2d');
//         postTypeChart = new Chart(ctx, {
//             type: 'radar',
//             data: {
//                 labels: ['link', 'status', 'photo', 'video', 'offer'],
//                 datasets: [
//                     {
//                         label: '2018',
//                         data: totLink18, totStatus18, totalPhoto18, totalVideo18, totalOffer18,
//                         backgroundColor: 'rgba(107,142,35,5)',
//                         borderColor: 'rgba(85,107,47,1)',
//                         borderWidth: 3
//                     },{
//                         label: '2017',
//                         data: totLink17, totStatus17, totalPhoto17, totalVideo17, totalOffer17,
//                         backgroundColor: 'rgba(255,165,0, 0.8)',
//                         borderColor: 'rgba(255,165,0, 1)',
//                         borderWidth: 3

//                     }]
//             },
//             options: {
//                 scales: {
//                     xAxes: [{
//                         gridLines: {
//                             color: 'rgba(255, 255, 255,0.5)',
//                             lineWidth: 2
//                         }
//                     }],
//                     yAxes: [{
//                         gridLines: {
//                             color: 'rgba(255, 255, 255,0.5)',
//                             lineWidth: 2
//                         },
//                         ticks: {
//                             beginAtZero: true,
//                         }
//                     }]
//                 }
//             }
//         });



// }

// var allFriendChart;
// var friendNum;
// function plotFriend(chartid, newLikes, newLove, newHaha, newWow, newSad, newAngry, newTime, newFriend) {
//     var totNum = [];
//     var checkbox = document.getElementById("togFriBtn");
//     console.log("hi");

//     var checkbox_All = document.getElementById("togAllBtn");
//     var checkbox_Tot = document.getElementById("togTotBtn");
//     var checkbox_Fri = document.getElementById("togFriBtn");

//     for (var i = 0; i < selected_value; i++) {
//         totNum[i] = 0;
//         totNum[i] += newLikes[i];
//         totNum[i] += newLove[i];
//         totNum[i] += newHaha[i];
//         totNum[i] += newWow[i];
//         totNum[i] += newSad[i];
//         totNum[i] += newAngry[i];
//         totNum[i] /= newFriend; //

//         // if (totNum[i] < 0.2) {
//         //     totNum[i] *= -1;
//         // }
//         console.log(newLikes[i]);
//         console.log(totNum[i]);
//     }

//     var tempNum = [], tempTime = [];
//     for (i = 0; i < selected_value; i++) {
//         tempNum[i] = totNum[i];
//         tempTime[i] = newTime[i];
//     }

//     if (checkbox_Fri.checked) {

//         if (checkbox_All.checked) {
//             allReactChart.destroy();
//             checkbox_All.checked = false;
//         }
//         if (checkbox_Tot.checked) {
//             totalChart.destroy();
//             checkbox_Tot.checked = false;
//         }

//         var ctx = document.getElementById(chartid).getContext('2d');
//         allFriendChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: tempTime,
//                 datasets: [
//                     {
//                         label: 'Number of react',
//                         fill: true,
//                         data: totNum,
//                         backgroundColor: 'rgba(107,142,35,5)',
//                         borderColor: 'rgba(85,107,47,1)',
//                         borderWidth: 3
//                     }]
//             },
//             options: {
//                 scales: {
//                     xAxes: [{
//                         gridLines: {
//                             color: 'rgba(255, 255, 255,0.5)',
//                             lineWidth: 2
//                         }
//                     }],
//                     yAxes: [{
//                         gridLines: {
//                             color: 'rgba(255, 255, 255,0.5)',
//                             lineWidth: 2
//                         },
//                         ticks: {
//                             beginAtZero: true,
//                         }
//                     }]
//                 }
//             }
//         });


//     }
//     else if (!checkbox_Fri.checked) {
//         allFriendChart.destroy();

//     }
// }

// var likechart, reactchart;
// function plot(chartid,newdata,newlabel){
//     var checkbox = document.getElementById("togLBtn");



//     if(checkbox.checked){
//         var ctx = document.getElementById(chartid).getContext('2d');
//         likechart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: newlabel,
//                 datasets: [{
//                     label: 'Number of Likes',
//                     data: newdata,
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)'
//                         // 'rgba(54, 162, 235, 0.2)',
//                         // 'rgba(255, 206, 86, 0.2)',
//                         // 'rgba(75, 192, 192, 0.2)',
//                         // 'rgba(153, 102, 255, 0.2)',
//                         // 'rgba(255, 159, 64, 0.2)'
//                     ],
//                     // borderColor: [
//                     //     'rgba(255,99,132,1)',
//                     //     'rgba(54, 162, 235, 1)',
//                     //     'rgba(255, 206, 86, 1)',
//                     //     'rgba(75, 192, 192, 1)',
//                     //     'rgba(153, 102, 255, 1)',
//                     //     'rgba(255, 159, 64, 1)'
//                     // ],
//                     borderWidth: 0.5
//                 },{
//                     data: newdata,
//                     type:'line'
//                 }]
//             },
//             options: {
//             responsive: true,
//                 scales: {
//                     yAxes: [{
//                         ticks: {
//                             beginAtZero:true
//                         }
//                     }]
//                 }
//             }
//         });
//     } else if (!checkbox.checked) {
//         likechart.destroy();
//     }
// }


// function plotReaction(chartid,newLikes,newLove,newHaha,newWow,newSad,newAngry){
//     console.log(newAngry[0]);
//     console.log(newLove[8]);
//     console.log(newAngry[2]);
//     // newAngry[3], newAngry[4], newAngry[5], newAngry[6]);
//     var checkbox = document.getElementById("togRBtn");
//     if(checkbox.checked){
//     var ctx = document.getElementById(chartid).getContext('2d');
//         reactchart = new Chart(ctx, {
//             type: 'polarArea',
//             data: {
//                 labels: ["likes", "love", "haha", "wow", "sad", "angry"],
//                 datasets: [{
//                     label: 'Number of Reaction',
//                     data: [newLikes, newLove, newHaha, newWow, newSad, newAngry],
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                         'rgba(255, 159, 64, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(255,99,132,1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(153, 102, 255, 1)',
//                         'rgba(255, 159, 64, 1)'
//                     ],
//                     borderWidth: 5
//                 }]
//             },
//             options: {
//                 scales: {
//                     yAxes: [{
//                         ticks: {
//                             beginAtZero:true
//                         }
//                     }]
//                 }
//             }
//         });
//     } else if (!checkbox.checked) {
//         reactchart.destroy();
//     }
// }



// function addData(newdata,newlabel) {
//     // var data = [5,10,50,100];
//     // linechart.data.labels.pop();
//     linechart.data.labels.push(newlabel);
//     linechart.data.datasets[0].data = newdata;
//     linechart.update();
// }