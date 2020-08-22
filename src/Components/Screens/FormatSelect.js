import React from 'react';

export default function FormatSelect(props) {
    const {onFormatChange, currentScreenIndex, screenIndex, outputformat} = props;
    
    if (parseInt(screenIndex) !== parseInt(currentScreenIndex)) {
        return null;
    }

    function handleFormatChange(e) {
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