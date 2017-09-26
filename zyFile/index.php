    public function path(){
        $path = C('IMAGE_PATH') . '/Business/';
        if (!is_dir("{$path}")) {
            mkdir("{$path}", 0777, true);
        }

        return $path;
    }

    public function saveImage(){
        $data = lm_get();
        $base64 = $data['src'];
        preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64, $result);
        if($data['flag']){
            if (unlink($data['flag']))
            {
                $savepath = $data['flag'];

            }else{
                exit(json_encode([status=>400]));
            }
        }else{
            $type = $result[2];    //获取图片的类型jpg png等
            $name = time().rand(100,9999);; //图片重命名
            $savepath = $this->path().$name.'.'.$type;   //图片保存目录
        }




        $info = file_put_contents($savepath, base64_decode(str_replace($result[1], '', $base64)));   //对图片进行解析并保存
        if ($info) {
            echo json_encode([info=>$info,status=>200,flag=>$savepath]);
        }else{
            echo json_encode($info);
        }
        /*$data = lm_get();
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array('jpg', 'png', 'jpeg'); // 设置附件上传类型
        $path = C('IMAGE_PATH') . '/Business';
        if (!is_dir("{$path}")) {
            mkdir("{$path}", 0777, true);
        }

        $upload->savePath = C('IMAGE_PATH')."/Business/"; // 设置附件上传根目录
        $upload->rootPath = C('IMAGE_PATH')."/Business/";
        $upload->autoSub = false;
        $info = $upload->upload();
        if ($info) {
            echo json_encode([info=>$info,status=>200]);
        }else{
            echo json_encode($info);
        }*/
    }

    public function deleteImage(){
        $data = lm_get();
        if (unlink($data['flag']))
        {
            echo json_encode([status=>200]);
        }
        else
        {
            echo json_encode([status=>200]);
        }
    }