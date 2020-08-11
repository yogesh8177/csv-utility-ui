import React, {useState} from 'react';
import ActionType        from './ActionType';
import FormatSelect      from './FormatSelect';
import MappingFields     from './MappingFields';
import PreviewOperation  from './PreviewOperation';

export default function ScreenContainer(props) {
    const [operation, setOperation]  = useState('');
    const [outputformat, setFormat]  = useState('');
    const [mapping, setMapping]      = useState('');
    const [sequence, setSequence]    = useState('');
    const [file, setFile]            = useState(null);

    const [currentScreen, setCurrentScreen] = useState(1);

    function handleOperationChange(e) {
        console.log({target: e.target.name, value: e.target.value});
        setOperation(e.target.value);
    }

    function handleOutputFormatChange(e) {
        console.log({target: e.target.name, value: e.target.value});
        setFormat(e.target.value);
    }

    function handleMappingChange(e) {
        setMapping(e.target.value);
    }

    function handleSequenceChange(e) {
        setSequence(e.target.value);
    }

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    function resetScreenState() {
        setOperation('');
        setFormat('');
        setMapping('');
        setSequence('');
        setFile(null);
        setCurrentScreen(1);
    }

    return (
        <>
            <ActionType 
                onActionChange     = {handleOperationChange}
                screenIndex        = '1'
                currentScreenIndex = {currentScreen}
            />

            <FormatSelect 
                onFormatChange     = {handleOutputFormatChange}
                screenIndex        = '2'
                currentScreenIndex = {currentScreen}
            />

            <MappingFields
                onMappingChange    = {handleMappingChange}
                onSequenceChange   = {handleSequenceChange}
                onFileChange       = {handleFileChange}
                screenIndex        = '3'
                currentScreenIndex = {currentScreen}
            />
            
            <PreviewOperation 
                operation          = {operation}
                outputformat       = {outputformat}
                mapping            = {mapping}
                sequence           = {sequence}
                file               = {file}
                screenIndex        = '4'
                currentScreenIndex = {currentScreen}
                triggerScreenReset = {resetScreenState}
            />

            <div className='ui-screen-navigation'>
                <button className='ui-screen-nav-buttons ui-nav-prev' onClick={() => setCurrentScreen(currentScreen - 1)} disabled={currentScreen <= 1 ? true : false}>Prev</button>
                <button className='ui-screen-nav-buttons ui-nav-next' onClick={() => setCurrentScreen(currentScreen + 1)} disabled={currentScreen >= 4 ? true : false}>Next</button>
            </div>
        </>
    );
}