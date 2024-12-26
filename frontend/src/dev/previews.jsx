import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import ChatPage from "../pages/ChatPage";
import App from "../App";

const ComponentPreviews = () => {
	return (
		<Previews palette={<PaletteTree/>}>
			<ComponentPreview path="/ChatPage">
				<ChatPage/>
			</ComponentPreview>
			<ComponentPreview path="/App">
				<App/>
			</ComponentPreview>
		</Previews>
	)
}

export default ComponentPreviews