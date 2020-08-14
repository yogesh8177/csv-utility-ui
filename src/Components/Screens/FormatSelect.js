import React, {useState} from 'react';

export default function FormatSelect(props) {
    const {onFormatChange, currentScreenIndex, screenIndex, outputformat} = props;
    
    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function handleFormatChange(e) {
        console.log('setting format', e.target.value);
        onFormatChange(e);
    }

    return (
        <>
            <div>
                <label>Output format</label><br/>
                <select defaultValue={outputformat} onChange={handleFormatChange} name='Format' className='ui-select'>
                    <option value=''>Select</option>
                    <option value='csv'>CSV</option>
                    <option value='json'>JSON</option>
                </select>
            </div>
        </>
    );
}