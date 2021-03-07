import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { useUploader } from "../hooks";

const Uploader = () => {
  const {
    loading,
    imageUrl,
    handleChange,
    customRequest,
    beforeUpload,
  } = useUploader();

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload.Dragger
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload.Dragger>
  );
};

export default Uploader;
