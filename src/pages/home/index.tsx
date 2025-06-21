import AccomodateCard from './components/AccomodateCard'
import InstructionBanner from './components/InstructionBanner'
import NoticeCard from './components/NoticeCard'
import PostListItemDemo from './components/PostListDemo'

const Home = () => {
	return (
		<div className='space-y-5'>
			<InstructionBanner />
			<NoticeCard />
			<AccomodateCard />
			<PostListItemDemo />
		</div>
	)
}

export default Home
