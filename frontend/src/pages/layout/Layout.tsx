import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { HistoryButton, ShareButton, SystemButton, ConfigButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus } from "../../api";

const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const [shareLabel, setShareLabel] = useState<string | undefined>("Share");
    const [SystemPromptLabel, setSytemPromptLabel] = useState<string | undefined>("System Prompt");
    const [ConfigLabel, setConfigLabel] = useState<string | undefined>("Config");
    const [hideHistoryLabel, setHideHistoryLabel] = useState<string>("Hide chat history");
    const [showHistoryLabel, setShowHistoryLabel] = useState<string>("Show chat history");
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;

    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    //Config Panel
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [updateConfigText, setUpdateConfigText] = useState('Update');
    const [configText, setConfigText] = useState('');

    const handleConfigPanelDismiss = () => {
        setIsConfigPanelOpen(false);
    };

    const handleUpdateConfigClick = async () => {
        setUpdateConfigText('Updating...');
        await updateConfig();
        // Perform update logic here
        setTimeout(() => {
            setUpdateConfigText('Update');
            setIsConfigPanelOpen(false);
        }, 2000);
    };

    const getConfig = async () => {
        const response = await fetch('/api/get-configuration', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.message;
    };

    const updateConfig = async () => {
        const response = await fetch('/api/update-configuration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: configText }),
        });
        const data = await response.json();
        return data.message;
    };

    const handleConfigClick = async () => {
        const message = await getConfig();

        // convert message from json to string
        const messageString = JSON.stringify(message);
        setConfigText(messageString);
        setIsConfigPanelOpen(true);
    };

    //System Prompt Panel
    const [isSystemPanelOpen, setIsSystemPanelOpen] = useState(false);
    const [updateSystemPromptText, setUpdateSystemPromptText] = useState('Update');
    const [systemPromptText, setSystemPromptText] = useState('');

    const handleSystemPanelDismiss = () => {
        setIsSystemPanelOpen(false);
    };

    const handleUpdateSystemPromptClick = async () => {
        setUpdateSystemPromptText('Updating...');
        await updateSystemPrompt();
        // Perform update logic here
        setTimeout(() => {
            setUpdateSystemPromptText('Update');
            setIsSystemPanelOpen(false);
        }, 2000);
    };

    const getSystemPrompt = async () => {
        const response = await fetch('/api/get-system-prompt-message', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.message;
    };

    const updateSystemPrompt = async () => {
        const response = await fetch('/api/update-system-prompt-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: systemPromptText }),
        });
        const data = await response.json();
        return data.message;
    };

    const handleSystemPromptClick = async () => {
        const message = await getSystemPrompt();
        setSystemPromptText(message);
        setIsSystemPanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) {
                setShareLabel(undefined)
                setHideHistoryLabel("Hide history")
                setShowHistoryLabel("Show history")
            } else {
                setShareLabel("Share")
                setHideHistoryLabel("Hide chat history")
                setShowHistoryLabel("Show chat history")
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={ui?.logo ? ui.logo : Contoso}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>{ui?.title}</h1>
                        </Link>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
                        {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) &&
                            <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel} />
                        }
                        {ui?.show_share_button && <ShareButton onClick={handleShareClick} text={shareLabel} />}
                        {ui?.show_system_prompt_button && <SystemButton onClick={handleSystemPromptClick} text={SystemPromptLabel} />}
                        {ui?.show_config_button && <ConfigButton onClick={handleConfigClick} text={ConfigLabel} />}
                    </Stack>
                </Stack>
            </header>
            <Outlet />

            <Dialog
                onDismiss={handleSystemPanelDismiss}
                hidden={!isSystemPanelOpen}
                styles={{
                    main: [
                        {
                            selectors: {
                                ['@media (min-width: 480px)']: {
                                    maxWidth: '1200px',
                                    background: '#FFFFFF',
                                    boxShadow:
                                        '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxHeight: '400px',
                                    minHeight: '100px',
                                },
                            },
                        },
                    ],
                }}
                dialogContentProps={{
                    title: 'System Prompt',
                    showCloseButton: true,
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: '8px' }}>
                    <TextField
                        multiline
                        rows={4}
                        value={systemPromptText}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement | HTMLTextAreaElement;
                            setSystemPromptText(target.value);
                        }}
                    />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Update"
                        onClick={handleUpdateSystemPromptClick}
                        onKeyDown={(e) =>
                            e.key === 'Enter' || e.key === ' ' ? handleUpdateSystemPromptClick() : null
                        }
                    >
                        <CopyRegular />
                        <span className={styles.ButtonText}>{updateSystemPromptText}</span>
                    </div>
                </Stack>
            </Dialog>

            <Dialog
                onDismiss={handleConfigPanelDismiss}
                hidden={!isConfigPanelOpen}
                styles={{
                    main: [
                        {
                            selectors: {
                                ['@media (min-width: 480px)']: {
                                    maxWidth: '2500px',
                                    background: '#FFFFFF',
                                    boxShadow:
                                        '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    maxHeight: '400px',
                                    minHeight: '100px',
                                },
                            },
                        },
                    ],
                }}
                dialogContentProps={{
                    title: 'Configuration',
                    showCloseButton: true,
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: '8px' }}>
                    <TextField
                        multiline
                        rows={10}
                        // format value to pretty json and remove slashes
                        value={configText.replace(/\\/g, '').replace(/"{/g, '{').replace(/}"/g, '}').replace(/,"/g, ', "')}



                        onChange={(e) => {
                            const target = e.target as HTMLInputElement | HTMLTextAreaElement;
                            setConfigText(target.value);
                        }}
                    />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Update"
                        onClick={handleUpdateConfigClick}
                        onKeyDown={(e) =>
                            e.key === 'Enter' || e.key === ' ' ? handleUpdateConfigClick() : null
                        }
                    >
                        <CopyRegular />
                        <span className={styles.ButtonText}>{updateConfigText}</span>
                    </div>
                </Stack>
            </Dialog>

            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Layout;
