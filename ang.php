<?php
    const FILE_NAME = 'ang.txt';
header('Access-Control-Allow-Origin: *');

$action = $_REQUEST['action'] ? : '';


$textData = file_get_contents(FILE_NAME);

if ($action == 'save') {
    $rawData   = file_get_contents("php://input");
    $aRawData  = json_decode($rawData, true);
    $aTextData = json_decode($textData, true);
    if (empty($aRawData['id'])) {
        $id             = rand(0, 100000000);
        $aRawData['id'] = $id;
        $aTextData[]    = $aRawData;
    } else {

        if (!empty($aTextData)) {
            foreach ($aTextData as $index => $row) {
                if ($row['id'] == $aRawData['id']) {
                    unset($aRawData['s']);
                    $aTextData[$index] = $aRawData;
                }
            }
        }
    }

    file_put_contents(FILE_NAME, json_encode($aTextData));
//['status' => 'success', 'total' => $c, 'rows' => $query->getArrayResult()
    $aRawData['s'] = $aRawData['id'].'#'.rand(0, 9999);
    echo json_encode($aRawData);
    //  echo json_encode(['status' => 'success', 'total' => count($aTextData), 'rows' => $aTextData[$page]]);
    die();
}

if ($action == 'remove') {
    $id = $_REQUEST['id'] ? : 0;

    $aTextData = json_decode($textData, true);
    foreach ($aTextData as $index => $row) {
        if ($row['id'] == $id) {
            unset($aTextData[$index]);
        }
    }

    file_put_contents(FILE_NAME, json_encode(array_values($aTextData)));

    echo(json_encode(['status'=>'OK']));
    die();
}

if ($action == 'getOne') {
    $id = $_REQUEST['id'] ? : 0;

    $aTextData = json_decode($textData, true);
    $aRawData  = [];
    foreach ($aTextData as $index => $row) {
        if ($row['id'] == $id) {
            $aRawData = $aTextData[$index];
        }
    }
    $aRawData['s'] = $aRawData['id'].'#'.rand(0, 9999);
    echo json_encode($aRawData);
    die();
}


if ($action == 'add100') {

    $data     = file_get_contents("php://input");
    $postData = json_decode($data, true);
    $cnt      = (isset($postData['cnt'])) ? (int) $postData['cnt'] : 0;

    $textData  = file_get_contents(FILE_NAME);
    $aTextData = json_decode($textData, true);
    $max       = 1;
    foreach ($aTextData as $row) {
        if ($max < $row[id]) {
            $max = $row[id];
        }
    }
    for ($i = 0; $i < $cnt; $i++) {
        $max++;
        $aRawData['id']          = $max;
        $aRawData['title']       = 'title '.$max;
        $aRawData['description'] = 'description '.$max;

        $aTextData[$aRawData['id']] = $aRawData;
    }
    file_put_contents(FILE_NAME, json_encode($aTextData));
    $textData = file_get_contents(FILE_NAME);
}
$aTextData = json_decode($textData, true);
$rows      = [];


$page     = isset($_REQUEST['page']) ? $_REQUEST['page'] : 1;
$countRec = isset($_REQUEST['count_rec']) ? $_REQUEST['count_rec'] : 1;

if (!empty($aTextData)) {
    $cntRows = count($aTextData);
    $offset  = ($page - 1) * $countRec;
    if ($offset < $cntRows) {
        for ($i = $offset; $i < $cntRows && $i < $page * $countRec; $i++) {
            $rows[] = $aTextData[$i];
        }
    }
}
echo json_encode(
    [
        'status' => 'success',
        'total' => $cntRows,
        'rows' => $rows,
        'page' => $page,
        'countRec' => $countRec,
        'offset' => $offset
    ]
);
