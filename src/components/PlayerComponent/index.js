import React, {useEffect, useState, useRef} from 'react';
import {
    FaUndoAlt,
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeDown,
    FaVolumeOff,
    FaVolumeMute,
    FaArrowLeft,
    FaExpand,
    FaStepForward,
    FaCog,
    FaClone,
    FaCompress,
    FaRedoAlt
} from 'react-icons/fa';
import {FiCheck, FiX} from 'react-icons/fi';
import {secondsToHms} from 'Utils/Time'
import './styles.scss'


export default function PlayerComponent(props) {

    // Referências
    const videoComponent = useRef(null);
    const timerRef = useRef(null);
    const timerBuffer = useRef(null);
    const playerElement = useRef(null);
    const listReproduction = useRef(null);

    // Estados
    const [videoReady, setVideoReady] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [end, setEnd] = useState(false);
    const [controllBackEnd, setControllBackEnd] = useState(false);
    const [fullSreen, setFullSreen] = useState(false);
    const [volume, setVolume] = useState(100);
    const [mutted, setMutted] = useState(false);
    const [error, setError] = useState(false);
    const [waitingBuffer, setWaitingBuffer] = useState(false);
    const [showControlls, setShowControlls] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const [showControllVolume, setShowControllVolume] = useState(false);
    const [showQuallity, setShowQuallity] = useState(false);
    const [showDataNext, setShowDataNext] = useState(false);
    const [showReproductionList, setShowReproductionList] = useState(false);

    const [atualBuffer, setAtualBuffer] = useState({
        index: 0,
        start: 0,
        end: 0
    });


    const timeUpdate = e => {
        setShowInfo(false);
        setEnd(false);
        if (playing) {
            setPlaying(true);
        }

        if (waitingBuffer) {
            setWaitingBuffer(false);
        }

        if (timerBuffer.current) {
            clearTimeout(timerBuffer.current);
        }

        timerBuffer.current = setTimeout(() => setWaitingBuffer(true), 1000);

        if (props.onTimeUpdate) {
            props.onTimeUpdate(e);
        }

        let choseBuffer = 0;
        let lenghtBuffer = e.target.buffered.length;
        let start = 0;
        let end = 0;
        let atualTime = e.target.currentTime;

        for (let i = 1; i <= lenghtBuffer; i++) {
            let startCheck = e.target.buffered.start(i - 1);
            let endCheck = e.target.buffered.end(i - 1);

            if (endCheck > atualTime && atualTime > startCheck) {
                choseBuffer = i;

                if (endCheck > end) {
                    end = endCheck;
                }

                if (startCheck < start) {
                    start = startCheck;
                }
            }
        }

        setAtualBuffer({
            index: choseBuffer,
            start: start,
            end: end
        });

        setProgress(e.target.currentTime);
    };

    const goToPosition = position => {
        videoComponent.current.currentTime = position;
        setProgress(position);
    };

    const alteraStatusVideo = () => {
        setDuration(videoComponent.current.duration);
    };

    const play = () => {
        setPlaying(!playing);

        if (videoComponent.current.paused) {
            videoComponent.current.play();
            return;
        }

        videoComponent.current.pause();
    };

    const onEnded = () => {
        if (+props.startPosition === +videoComponent.current.duration && !controllBackEnd) {
            setControllBackEnd(true);
            videoComponent.current.currentTime = videoComponent.current.duration - 30;
            if (props.autoPlay) {
                setPlaying(true);
                videoComponent.current.play();
            } else {
                setPlaying(false);
            }
        } else {
            setEnd(true);
            setPlaying(false);

            if (props.onEnded) {
                props.onEnded()
            }
        }

    };

    const nextSeconds = (seconds) => {
        let current = videoComponent.current.currentTime;
        let total = videoComponent.current.duration;

        if (current + seconds >= total - 2) {
            videoComponent.current.currentTime = videoComponent.current.duration - 1;
            setProgress(videoComponent.current.duration - 1);
            return;
        }

        videoComponent.current.currentTime = videoComponent.current.currentTime + seconds;
        setProgress(videoComponent.current.currentTime + seconds);
    };

    const previousSeconds = (seconds) => {
        let current = videoComponent.current.currentTime;

        if (current - seconds <= 0) {
            videoComponent.current.currentTime = 0;
            setProgress(0);
            return;
        }

        videoComponent.current.currentTime = videoComponent.current.currentTime - seconds;
        setProgress(videoComponent.current.currentTime - seconds);

    };

    const liberarVideo = () => {
        alteraStatusVideo();
        setVideoReady(true);
    };

    const erroVideo = (e) => {
        if (props.onErrorVideo) {
            props.onErrorVideo();
        }
        setError("Ocorreu um erro ao tentar reproduzir este vídeo -_-");
    };

    const setMuttedAction = (value) => {
        setMutted(value);
        setShowControllVolume(false);
        videoComponent.current.muted = value;
    };

    const setVolumeAction = (value) => {
        setVolume(value);
        videoComponent.current.volume = value / 100;
    };

    const exitFullScreen = () => {
        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
            document.exitFullscreen();
        }
    }

    const enterFullScreen = () => {
        setShowInfo(true);
        playerElement.current.requestFullscreen();
        setFullSreen(true);
    }

    const chooseFullScreen = () => {

        if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
            document.exitFullscreen();
            return;
        }

        setShowInfo(true);
        playerElement.current.requestFullscreen();
        setFullSreen(true);
    }

    const setStateFullScreen = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            setFullSreen(false);
            return;
        }

        setFullSreen(true);
    }

    const controllScreenTimeOut = () => {
        setShowControlls(false);
        if (!playing) {
            setShowInfo(true);
        }
    };

    const getKeyBoardInteration = e => {
        if (e.keyCode === 32 && videoComponent.current) {
            if (videoComponent.current.paused) {
                videoComponent.current.play();
                setPlaying(true);
                hoverScreen();
            } else {
                videoComponent.current.pause();
                setPlaying(false);
                hoverScreen();
            }
        }
    };


    const hoverScreen = () => {
        setShowControlls(true);
        setShowInfo(false);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(controllScreenTimeOut, 5000);
    };

    const scrollToSelected = () => {
        let element = listReproduction.current;
        let selected = element.getElementsByClassName('selected')[0];
        let position = selected.offsetTop;
        let height = selected.offsetHeight;
        element.scrollTop = position - (height*2);
    };

    useEffect(() => {
        if (showReproductionList) {
            scrollToSelected();
        }
    }, [showReproductionList])

    useEffect(() => {
        if (props.src) {
            videoComponent.current.currentTime = props.startPosition;
            setProgress(0);
            setDuration(0);
            setVideoReady(false);
            setError(false);
            setShowReproductionList(false);
            setShowDataNext(false);
            setAtualBuffer({
                index: 0,
                start: 0,
                end: 0,
            });
            setPlaying(props.autoPlay);
        }
    }, [props.src]);

    useEffect(() => {
        document.addEventListener("keydown", getKeyBoardInteration, false);
        playerElement.current.addEventListener("fullscreenchange", setStateFullScreen, false);
    }, []);

    function renderLoading() {
        return (
            <div className='loading'>
                <div className='loading-component'>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        )
    }

    function renderInfoVideo() {
        return (
            <div
                className={`sobre-video ${showInfo === true && videoReady === true && playing === false ? 'opacity-100' : 'opacity-0'}`}>
                {(props.title || props.subTitle) && (
                    <div className='center'>
                        <div className='text'>Você está assistindo</div>
                        <div className='title'>{props.title}</div>
                        <div className='sub-title'>{props.subTitle}</div>
                    </div>
                )}
                <div className='botton'>Pausado</div>
            </div>
        )
    }

    function renderCloseVideo() {
        return (
            <div
                className={`sobre-video-loading ${videoReady === false || (videoReady === true && error) ? 'opacity-100' : 'opacity-0 z-index-0'}`}>

                {(props.title || props.subTitle) && (
                    <div className='header-loading'>
                        <div>
                            <div className='title'>{props.title}</div>
                            <div className='sub-title'>{props.subTitle}</div>
                        </div>
                        <FiX onClick={props.onCrossClick}/>
                    </div>
                )}

                <div className={`error ${error ? 'opacity-100' : 'opacity-0'}`}>
                    {error && (
                        <div>
                            <h1>{error}</h1>
                            {props.qualities.length > 1 && (
                                <div>
                                    <p>Tente acessar por outra qualidade</p>
                                    <div className='links-error'>
                                        {props.qualities.map(item => (
                                            <div onClick={() => {
                                                props.onChangeQuality(item.id)
                                            }}>
                                                {item.prefix && (
                                                    <span>HD</span>
                                                )}

                                                <span>{item.nome}</span>
                                                {item.playing && (
                                                    <FiX/>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div
            id='player-component'
            onMouseMove={hoverScreen}
            ref={playerElement}
            className={props.fullPlayer ? "player-component full" : "player-component"}
            onDoubleClick={chooseFullScreen}
        >
            {(videoReady === false || (waitingBuffer === true && playing === true)) && !error && !end && renderLoading()}

            {renderInfoVideo()}

            {renderCloseVideo()}

            <video className={`${!error ? 'opacity-100' : 'opacity-0'}`}
                   id='player-video'
                   ref={videoComponent}
                   src={props.src}
                   controls={false}
                   autoPlay={props.autoPlay}
                   onCanPlay={() => liberarVideo()}
                   onTimeUpdate={timeUpdate}
                   onError={erroVideo}
                   onEnded={onEnded}
            />

            <div
                className={`player-controlls ${showControlls === true && videoReady === true && error === false ? 'opacity-100 scale-0' : 'opacity-0 scale-1'}`}>

                {props.backButton && (
                    <div className='back'>
                        <div onClick={props.backButton} style={{cursor: 'pointer'}}>
                            <FaArrowLeft/>
                            <span>Voltar à navegação</span></div>
                    </div>
                )}

                {(showControllVolume !== true && showQuallity !== true && !showDataNext && !showReproductionList) && (
                    <div className='line-reproduction'>
                        <input
                            type='range' value={progress}
                            className='progress-bar'
                            max={duration}
                            onChange={e => goToPosition(e.target.value)}
                            title=''
                            style={{background: `linear-gradient(93deg, rgba(247,139,40,1) ${progress * 100 / duration}%, rgba(210,210,210,1) ${progress * 100 / duration}%,  rgba(150,150,150,1) ${atualBuffer.end * 100 / duration}%, rgba(200,200,200,1) ${atualBuffer.end * 100 / duration}%)`}}
                        />
                        <span>{secondsToHms(duration - progress)}</span>
                    </div>
                )}

                {videoReady === true && (
                    <div className='controlls'>

                        <div className='start'>
                            <div className='item-control'>
                                {!playing && (<FaPlay onClick={play}/>)}
                                {playing && (<FaPause onClick={play}/>)}
                            </div>

                            <div className='item-control'>
                                <FaUndoAlt onClick={() => previousSeconds(5)}/>
                            </div>

                            <div className='item-control'>
                                <FaRedoAlt onClick={() => nextSeconds(5)}/>
                            </div>

                            {mutted === false && (
                                <div onMouseLeave={() => setShowControllVolume(false)}
                                     className='item-control volumn-component'>
                                    {showControllVolume === true && (
                                        <div className='volumn-controll'>
                                            <div className='box-connector'/>
                                            <div className='box'>
                                                <input
                                                    style={{background: `linear-gradient(93deg, rgba(247,139,40,1) ${volume}%, rgba(210,210,210,1) ${volume}%)`}}
                                                    type="range"
                                                    min={0}
                                                    max={100}
                                                    value={volume}
                                                    onChange={e => setVolumeAction(e.target.value)}
                                                    title=''
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {volume >= 60 && (
                                        <FaVolumeUp
                                            onMouseEnter={() => setShowControllVolume(true)}
                                            onClick={() => setMuttedAction(true)}
                                        />
                                    )}

                                    {volume < 60 && volume >= 10 && (
                                        <FaVolumeDown
                                            onMouseEnter={() => setShowControllVolume(true)}
                                            onClick={() => setMuttedAction(true)}
                                        />
                                    )}

                                    {volume < 10 && volume > 0 && (
                                        <FaVolumeOff
                                            onMouseEnter={() => setShowControllVolume(true)}
                                            onClick={() => setMuttedAction(true)}
                                        />
                                    )}

                                    {volume <= 0 && (
                                        <FaVolumeMute
                                            onMouseEnter={() => setShowControllVolume(true)}
                                            onClick={() => setVolumeAction(0)}
                                        />
                                    )}

                                </div>
                            )}

                            {mutted === true && (
                                <div className='item-control'>
                                    <FaVolumeMute onClick={() => setMuttedAction(false)}/>
                                </div>
                            )}


                            <div className='item-control info-video'>
                                <span className='info-first'>{props.titleMedia}</span>
                                <span className='info-secund'>{props.extraInfoMedia}</span>
                            </div>

                        </div>

                        <div className='end'>
                            {props.onNextClick && (
                                <div className='item-control' onMouseLeave={() => setShowDataNext(false)}>

                                    {showDataNext === true && props.dataNext.title && (
                                        <div className='item-component'>
                                            <div className='content-next'>
                                                <div className='title'>
                                                    Próximo Episódio
                                                </div>
                                                <div className='item' onClick={props.onNextClick}>
                                                    <div className='bold'>{props.dataNext.title}</div>
                                                    {props.dataNext.description && (
                                                        <div>{props.dataNext.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='box-connector'/>
                                        </div>
                                    )}

                                    <FaStepForward onClick={props.onNextClick}
                                                   onMouseEnter={() => setShowDataNext(true)}/>
                                </div>
                            )}

                            <div className='item-control' onMouseLeave={() => setShowReproductionList(false)}>
                                {showReproductionList && (
                                    <div className='item-component item-component-list-rep'>
                                        <div className='content-list-reprodution'>
                                            <div className='title'>
                                                Lista de Reprodução
                                            </div>
                                            <div ref={listReproduction}
                                                 className='list-list-reproduction scroll-clean-player'>
                                                {props.reprodutionList.map((item, index) =>
                                                    (<div
                                                        className={`item-list-reproduction ${item.playing && "selected"}`}
                                                        onClick={() => props.onClickItemListReproduction && props.onClickItemListReproduction(item.id, item.playing)}>
                                                        <div className='bold'><span
                                                            style={{marginRight: 15}}>{index + 1}</span>
                                                            {item.nome}</div>

                                                        {item.percent && (
                                                            <div className='percent'/>
                                                        )}
                                                    </div>)
                                                )}
                                            </div>
                                        </div>
                                        <div className='box-connector'/>
                                    </div>
                                )}
                                {props.reprodutionList && props.reprodutionList.length > 1 && (
                                    <FaClone onMouseEnter={() => setShowReproductionList(true)}/>
                                )}
                            </div>

                            {props.qualities && props.qualities.length > 1 && (
                                <div className='item-control' onMouseLeave={() => setShowQuallity(false)}>
                                    {showQuallity === true && (
                                        <div className='list-quality-component'>
                                            <div className='content'>
                                                {props.qualities && props.qualities.map(item => (
                                                    <div onClick={() => {
                                                        setShowQuallity(false);
                                                        props.onChangeQuality(item.id)
                                                    }}>
                                                        {item.prefix && (
                                                            <span>HD</span>
                                                        )}

                                                        <span>{item.nome}</span>
                                                        {item.playing && (
                                                            <FiCheck/>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='box-connector'/>
                                        </div>
                                    )}

                                    <FaCog onMouseEnter={() => setShowQuallity(true)}/>
                                </div>
                            )}

                            <div className='item-control'>
                                {fullSreen === false && (<FaExpand onClick={enterFullScreen}/>)}
                                {fullSreen === true && (<FaCompress onClick={exitFullScreen}/>)}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

PlayerComponent.defaultProps = {
    title: false,
    subTitle: false,
    titleMedia: false,
    extraInfoMedia: false,

    fullPlayer: true,
    backButton: false,

    // src: false,
    autoPlay: false,

    onCanPlay: false,
    onTimeUpdate: false,
    onEnded: false,
    onErrorVideo: false,
    onNextClick: false,
    onClickItemListReproduction: false,
    onCrossClick: () => {
    },
    startPosition: 0,

    dataNext: {},
    reprodutionList: []

};