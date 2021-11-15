import { RepeatIcon } from '@chakra-ui/icons'
import {
	Button,
	Flex,
	HStack,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { endpoints } from './endpoints'

export const App = () => {
	const [page, setPage] = useState<number>(1)
	const [reachedMax, setReachedMax] = useState<boolean>(false)
	const [time, setTime] = useState<string>(moment().format('HH:MM'))
	const [externalId, setExternalId] = useState<string>('')
	const [imageBase64, setImageBase64] = useState<string>()
	const [cameraList, setCameraList] = useState<Array<any>>([])
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

	async function getCameras() {
		const { data } = await axios.post(endpoints.list.url, {
			page,
			limit: 100,
			objectType: 'cameras',
			filter: '',
		})
		if (data.success) {
			data.data.page < data.data.pages ? setPage(page + 1) : setReachedMax(true)
			setCameraList([
				...cameraList,
				...data.data.docs.filter((x: any) => x.is_active),
			])
		}
	}

	useEffect(() => {
		if (!reachedMax) {
			getCameras()
		}
	})

	async function getImage() {
		const { data } = await axios.post(endpoints.image.url, {
			time,
			externalId,
		})
		if (data.success) {
			setImageBase64(data.data.image)
		}
	}

	return (
		<Flex
			p={'10px'}
			minH={'100vh'}
			flexDirection={'column'}
			justifyContent={'center'}
		>
			{isMobile ? (
				<VStack>
					<HStack>
						<VStack maxW={'60vw'}>
							<Select
								onChange={async (e) => {
									setExternalId(e.target.value)
									await getImage()
								}}
							>
								{cameraList.map((x, i) => (
									<option key={i} value={x.external_id} selected={i === 1}>
										{x.location_description}
									</option>
								))}
							</Select>
							<InputGroup>
								<Input
									value={time}
									onChange={async (e) => {
										setTime(e.target.value)
										await getImage()
									}}
								/>
								<InputRightElement>
									<IconButton
										aria-label="Reload time"
										icon={<RepeatIcon />}
										onClick={() => {
											setTime(moment(new Date()).format('HH:MM'))
										}}
									></IconButton>
								</InputRightElement>
							</InputGroup>
						</VStack>
						<Button
							colorScheme="blue"
							onClick={async () => {
								await getImage()
							}}
						>
							Get Image
						</Button>
					</HStack>
					{imageBase64 && (
						<Image
							src={`data:image/jpeg;base64,${imageBase64}`}
							maxH={'calc(100vh - 20px)'}
							maxW={'calc(80vw - 20px)'}
							borderRadius={'var(--chakra-radii-md)'}
						/>
					)}
				</VStack>
			) : (
				<HStack>
					<VStack maxW={'calc(20vw - 20px)'}>
						<Select
							onChange={async (e) => {
								setExternalId(e.target.value)
								await getImage()
							}}
						>
							{cameraList.map((x, i) => (
								<option key={i} value={x.external_id}>
									{x.location_description}
								</option>
							))}
						</Select>
						<InputGroup>
							<Input
								value={time}
								onChange={async (e) => {
									setTime(e.target.value)
									await getImage()
								}}
							/>
							<InputRightElement>
								<IconButton
									aria-label="Reload time"
									icon={<RepeatIcon />}
									onClick={() => {
										setTime(moment().format('HH:MM'))
										console.log(time)
									}}
								></IconButton>
							</InputRightElement>
						</InputGroup>
						<Button
							colorScheme="blue"
							onClick={async () => {
								await getImage()
							}}
						>
							Get Image
						</Button>
					</VStack>
					{imageBase64 && (
						<Image
							src={`data:image/jpeg;base64,${imageBase64}`}
							maxH={'calc(100vh - 20px)'}
							maxW={'calc(80vw - 20px)'}
							borderRadius={'var(--chakra-radii-md)'}
						/>
					)}
				</HStack>
			)}
		</Flex>
	)
}
