<!DOCTYPE html>
<html lang="en">
<head>
  <title>VizHub</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="chart.css">
  <link rel="stylesheet" href="https://bootswatch.com/4/superhero/bootstrap.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.6/p5.js"></script>
  <script src ="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script> 
</head>
<body>

<?php
// session_start();
// $likearray = $_SESSION['likes'];
// $lovearray = $_SESSION["love"];
// $hahaarray = $_SESSION["haha"];
// $wowarray = $_SESSION["wow"];
// $sadarray = $_SESSION["sad"];
// $angryarray = $_SESSION["angry"];
// $timearray = $_SESSION['time'];
?>

<?php

require_once  "vendor/autoload.php";

$dbhost ='localhost';
$dbport ='27017';

$client = new MongoDB\Client;
$connection = new MongoDB\Driver\Manager("mongodb://$dbhost:$dbport");

$query = new MongoDB\Driver\Query([]);
$likedata = $connection->executeQuery('fb.post', $query);

$likearray = array();
$timearray = array();
$highestLikes = 0;
$temporary = 0;

foreach ($likedata as $row) {   
    // $likearray [] = [];
    // echo $row->message;
    $likearray [] = $row->like->summary->total_count;
    $temporary = $row->like->summary->total_count;
    print($temporary . " ");
    if( $temporary > $highestLikes)
    {
        $highestLikes = $temporary;
    }
    
    // print($row->like->summary->total_count);
    // print($highestLikes);
    // print(" ");
    $timearray [] = $row->created_time;
}

$query = new MongoDB\Driver\Query([]);
$reactdata = $connection->executeQuery('fb.post', $query);

$lovearray = array();
$hahaarray = array();
$wowarray = array();
$sadarray = array();
$angryarray = array();
$num_comment = array();
$num_share = array();

foreach($reactdata as $row){
    $lovearray [] = $row->love->summary->total_count;
    $hahaarray [] = $row->haha->summary->total_count;
    $wowarray [] = $row->wow->summary->total_count;
    $sadarray [] = $row->sad->summary->total_count;
    $angryarray [] = $row->angry->summary->total_count;
    $num_comment [] = $row->comments->summary->total_count;

    if(!isset($row->shares)){
            $num_share [] = 0;
        }
        else 
        {
            $num_share [] = $row->shares->count;
        }
}

$user_details = $connection->executeQuery('fb.userdetail', $query);

foreach($user_details as $row){

    $num_friends = $row->friends->summary->total_count;    
}

?>

<h3>Toggle for graph!</h3>
<div class="triggerMessage" >Try CLICK on Parameter: Likes, Love, Haha, Wow, Sad, Angry.</div> 

<div class ="plot">
    <canvas id="chart" float="right" width="200" height="80" background="white"></canvas>
</div>

<label class="switch">
    <input type="checkbox" id="togAllBtn" onclick='plotAll("chart",<?php echo json_encode($likearray) ?>,<?php echo json_encode($lovearray) ?>,<?php echo json_encode($hahaarray) ?>,<?php echo json_encode($wowarray) ?>,<?php echo json_encode($sadarray) ?>,<?php echo json_encode($angryarray)?>,<?php echo json_encode($timearray) ?>)'>
    <div class="slider round">
        <span class="on">Reaction</span><span class="off">Reaction</span>
    </div>
</label>

<!-- <div style="width:25%;">
    <select>
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="15">15</option>
    <option value="20">20</option>
    </select>
</div> -->

<label class="switch">
    <input type="checkbox" id="togTotBtn" onclick='plotTotal("chart",<?php echo json_encode($likearray) ?>,<?php echo json_encode($lovearray) ?>,<?php echo json_encode($hahaarray) ?>,<?php echo json_encode($wowarray) ?>,<?php echo json_encode($sadarray) ?>,<?php echo json_encode($angryarray)?>)'>
    <div class="slider round">
        <span class="on">Total Reaction </span><span class="off">Total Reaction</span>
    </div>
</label>

<label class="switch">
    <input type="checkbox" id="togFriBtn" onclick='plotFriend("chart",<?php echo json_encode($likearray) ?>,<?php echo json_encode($lovearray) ?>,<?php echo json_encode($hahaarray) ?>,<?php echo json_encode($wowarray) ?>,<?php echo json_encode($sadarray) ?>,<?php echo json_encode($angryarray)?>,<?php echo json_encode($timearray)?>,<?php echo json_encode($num_friends)?>)'>

    <div class="slider round">
        <span class="on">Friend</span><span class="off">Friend</span>
    </div>
</label>


<!-- <div style="width:25%;">
<label>Time Selection: </label>

<?php
echo '<select id="timeSelect" onchange=  style=" height: 25px; width: 100px">';

foreach($timearray as $time){
    echo '<option value="' . htmlspecialchars($time) . '">'
        . htmlspecialchars($time) . '</option>';
}
echo '</select>';
?>
</div> -->

<div style="margin-left :15px">
    <select id="selected" style="display:none;">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50" selected>50</option>
    </select>
</div>

<p>We are still improving our visualization functionality!</p>
<?php
echo '<div class ="informMessage">';
echo '<div id="info" style="display:none;"><p>The highest number of likes is ' .htmlspecialchars($highestLikes).' </p></div>';
echo '</div>';
?> 
<script>



</script>
</body>
</html>