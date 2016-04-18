<?php
    const FILE_NAME = 'ang.txt';

$action   = isset($_REQUEST['action']) && $_REQUEST['action'];
$textData = file_get_contents(FILE_NAME);

if ($action == 'save') {
    $rawData   = file_get_contents("php://input");
    $aRawData  = json_decode($rawData, true);
    $aTextData = json_decode($textData, true);
    if (isset($aTextData[$aRawData['id']])) {
        $aTextData[$aRawData['id']] = $aRawData;

        file_put_contents(FILE_NAME, json_encode($aTextData));

        echo json_encode($aRawData);
        die();
    } elseif ($aRawData['id'] == 0) {

        $max = 0;

        foreach ($aTextData as $row) {
            if ($max < $row[id]) {
                $max = $row[id];
            }
        }
        $max++;
        $aRawData['id']             = $max;
        $aTextData[$aRawData['id']] = $aRawData;
        file_put_contents(FILE_NAME, json_encode($aTextData));

        echo json_encode($aRawData);
        die();
    }
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


echo $textData;
