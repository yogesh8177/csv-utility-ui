import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

export default function PreviewOperation(props) {
    const {operation, outputformat, mapping, sequence, file, currentScreenIndex, screenIndex, triggerScreenReset, userId} = props;

    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function displayToast(message, type) {
        toast[type](message);
    }

    async function fetchSignedUrl() {
        try {
            const payload = {
                metadata: {
                    operation,
                    mapping,
                    sequence,
                    outputformat,
                    jobId: uuidv4(),
                    userId
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

    function validateOperation() {
        if (
            (operation && operation !== '') &&
            (mapping && mapping !== '') &&
            (sequence && sequence !== '') &&
            (outputformat && outputformat !== '') &&
            file
        ) 
        {
            return true;
        }
        else {
            return false;
        }
    }

    async function handleUpload(e) {
        try {
            if (!validateOperation()) {
                toast.error('Please fill all fields');
                return;
            }
            displayToast('Thank you, you will be notified when file uploads!', 'info');
            triggerScreenReset();
            let signedUrl = await fetchSignedUrl();
            const formData = new FormData();
            Object.keys(signedUrl.fields).forEach(key => {
                formData.append(key, signedUrl.fields[key]);
            });
            formData.append('file', file, signedUrl.fields.Key);

            let response = await fetch(
                "https://s3.amazonaws.com/csv-uploads-storage",
                {
                    method: 'POST',
                    body: formData
                }
            );
            console.log({uploadResponse: response});
            const toastMessage = response.ok ? {message: 'Your job was submitted!', type: 'dark'} : {message: 'File upload failed!', type: 'error'};
            displayToast(toastMessage.message, toastMessage.type);
        }
        catch(error) {
            console.error({
                message: `Error while uploading file`,
                error
            });
            displayToast('Network error', 'error');
        }
    }

    return (
        <>
            <h2>Preview your operation</h2>
            <ul className='ui-list'>
                <li><label>Operation: <span className='preview operation'>{operation}</span></label></li>
                <li><label>Format: <span className='preview outputformat'>{outputformat}</span></label></li>
                <li><label>Mapping</label></li>
                <li><label><span className='preview mapping'>{mapping}</span></label></li>
                <li><label>Sequence: <span className='preview sequence'>{sequence}</span></label></li>
                <li><button className='action-btn upload' name='upload' onClick={handleUpload}>Upload</button></li>
            </ul>
           
        </>
    );
}