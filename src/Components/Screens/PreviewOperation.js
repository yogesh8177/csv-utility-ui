import React from 'react';

export default function MappingFields(props) {
    const {operation, outputformat, mapping, sequence, file, currentScreenIndex, screenIndex} = props;

    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    async function fetchSignedUrl() {
        try {
            const payload = {
                metadata: {
                    "operation": operation,
                    "mapping": mapping,
                    "sequence": sequence,
                    "outputformat": outputformat
                }
            };
            let response = await fetch(
                'https://05e9fny512.execute-api.us-east-1.amazonaws.com/test/GenerateSignedUrl',{
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            let signedResponse = await response.json();
            console.log({signedResponse});
            return signedResponse;
        }
        catch(error) {
            console.error({
                message: `Error while fetching signed url`,
                error
            });
            return Promise.reject(error);
        }
    } 

    async function handleUpload(e) {
        try {
            let signedUrl = await fetchSignedUrl();
            const formData = new FormData();
            Object.keys(signedUrl.fields).forEach(key => {
                formData.append(key, signedUrl.fields[key]);
            });
            const fileField = document.querySelector('input[type="file"]');
            formData.append('file', file, signedUrl.fields.Key);

            let response = await fetch(
                "https://s3.amazonaws.com/csv-uploads-storage",
                {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'multipart/form-data'
                    // },
                    body: formData
                }
            );
            console.log({uploadResponse: response});
            alert('File uploaded');
        }
        catch(error) {
            console.error({
                message: `Error while uploading file`,
                error
            });
        }
    }

    return (
        <>
            <ul className='ui-list'>
                <li><label>Operation: {operation}</label></li>
                <li><label>Format: {outputformat}</label></li>
                <li><label>Mapping: {mapping}</label></li>
                <li><label>Sequence: {sequence}</label></li>
                <li><button name='upload' onClick={handleUpload}>Upload</button></li>
            </ul>
           
        </>
    );
}