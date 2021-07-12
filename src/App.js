import { useState, useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { toast } from 'react-toastify';
import { IonConnector, PeerState } from 'ion-sdk-js/lib/ion';
import { v4 as uuidv4 } from 'uuid';

import { ION_SERVER } from './config';

import './App.css';
import { LoginForm } from './component';

const initialState = {
	login: false,
	localAudioEnabled: true,
	localVideoEnabled: true,
	screenSharingEnabled: false,
	collapsed: true,
	isFullScreen: false,
	vidFit: false,
	loginInfo: {},
	messages: [],
	uid: '',
	peers: []
};

function App() {
	const [state, setState] = useState({ ...initialState });
	const [connector, setConnector] = useState(null);
	const [settings, setSettings] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		let newSettings = {
			selectedAudioDevice: '',
			selectedVideoDevice: '',
			resolution: 'hd',
			bandwidth: 1024,
			codec: 'vp8',
			isDevMode: false
		};
		let storedSettings = reactLocalStorage.getObject('settings');
		if (storedSettings.codec !== undefined) newSettings = storedSettings;
		setSettings(newSettings);
	}, []);

	useEffect(() => {
		if (connector) {
			connector.onjoin = (success, reason) => {
				console.log('onjoin:', { success, reason });
			};
			connector.onleave = (reason) => {
				console.log('onleave: ', reason);
			};
			connector.onpeerevent = (ev) => {
				console.log('onpeerevent', ev);
			};
			connector.onmessage = (msg) => {
				console.log('onmessage', msg);
			};
			connector.onstreamevent = (ev) => {
				console.log('onstreamevent', ev);
			};
		}
	}, [connector]);

	const onJoin = async (values) => {
		try {
			setLoading(true);

			const connector = new IonConnector(ION_SERVER);
			setConnector(connector);

			const uid = uuidv4();

			reactLocalStorage.remove('loginInfo');
			reactLocalStorage.setObject('loginInfo', values);
			setState((prev) => ({
				...prev,
				uid,
				login: true,
				loginInfo: values,
				localVideoEnabled: !values.audioOnly
			}));

			// TODO => this.conference.handleLocalStream(true);

			toast('Connected!, Welcome to the ion room => ' + values.roomId);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<h3>hello world</h3>
			<LoginForm handleJoin={onJoin} isLoggedIn={state.login} />
		</div>
	);
}

export default App;
