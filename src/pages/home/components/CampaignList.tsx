import Carousel from '@/components/common/Carousel'
import { EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'
import CampaignCard from '@/pages/item-warehouse/components/CampaignCard'

// Demo Component
const CampaignList = () => {
	const sampleCampaigns: IPost[] = [
		{
			authorID: 1,
			authorName: 'Nguyễn Văn An',
			authorAvatar:
				'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAyADIAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBkQgUobHB0fAjM+HxFRZCUtIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAD/9k=',
			createdAt: '2024-12-15T10:30:00+07:00',
			description:
				'Chiến dịch thu thập sách cũ, đồ chơi và dụng cụ học tập để tặng cho trẻ em ở các vùng núi phía Bắc. Chúng tôi mong muốn mang tri thức và niềm vui đến với những em nhỏ thiếu thốn. Mọi cuốn sách dù cũ nhưng còn sử dụng được đều là những món quà ý nghĩa.',
			id: 1,
			images: [
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
			],
			info: JSON.stringify({
				startDate: '2024-01-15',
				endDate: '2024-02-28',
				location: 'Lào Cai, Hà Giang, Cao Bằng',
				organizer: 'Hội sinh viên Hà Nội'
			}),
			interestCount: 127,
			itemCount: 500,
			currentItemCount: 342,
			slug: 'tang-sach-cu-cho-tre-em-vung-cao',
			tags: ['Giáo dục', 'Từ thiện', 'Sách cũ'],
			title: 'Tặng sách cũ cho trẻ em vùng cao',
			status: 2,
			content: '',
			type: Number(EPostType.CAMPAIGN)
		},
		{
			authorID: 2,
			authorName: 'Trần Thị Hương',
			authorAvatar:
				'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAyADIAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBkQgUobHB0fAjM+HxFRZCUtIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==',
			createdAt: '2024-12-14T14:20:00+07:00',
			description:
				'Thu thập quần áo cũ còn tốt để hỗ trợ những người có hoàn cảnh khó khăn trong mùa đông lạnh giá. Đặc biệt cần áo ấm, áo khoác, chăn màn và các vật dụng giữ ấm khác.',
			id: 2,
			images: [
				'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=300&fit=crop'
			],
			info: JSON.stringify({
				startDate: '2024-12-01',
				endDate: '2024-12-31',
				location: 'Hà Nội, TP. Hồ Chí Minh, Đà Nẵng',
				organizer: 'Hội từ thiện Ấm lòng'
			}),
			interestCount: 89,
			itemCount: 300,
			currentItemCount: 156,
			slug: 'chia-se-am-ap-mua-dong',
			tags: ['Quần áo', 'Mùa đông', 'Từ thiện'],
			title: 'Chia sẻ ấm áp mùa đông',
			status: 2,
			content: '',
			type: Number(EPostType.CAMPAIGN)
		},
		{
			authorID: 3,
			authorName: 'Lê Minh Tuấn',
			createdAt: '2024-12-13T09:15:00+07:00',
			description:
				'Chiến dịch thu thập đồ chơi cũ nhưng còn sử dụng được để mang niềm vui đến với trẻ em mồ côi. Chúng tôi tin rằng mỗi món đồ chơi đều chứa đựng tình yêu thương và có thể tạo ra nụ cười trên khuôn mặt các em nhỏ.',
			id: 3,
			images: [
				'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'
			],
			info: JSON.stringify({
				startDate: '2024-11-20',
				endDate: '2024-12-20',
				location: 'Các trại trẻ mồ côi tại Hà Nội',
				organizer: 'Nhóm tình nguyện viên ĐH Bách Khoa'
			}),
			interestCount: 45,
			itemCount: 200,
			currentItemCount: 178,
			slug: 'do-choi-cho-tre-em-mo-coi',
			tags: ['Đồ chơi', 'Trẻ em', 'Mồ côi'],
			title: 'Đồ chơi cho trẻ em mồ côi',
			status: 2,
			content: '',
			type: Number(EPostType.CAMPAIGN)
		}
	]

	const handleCampaignClick = (campaign: any) => {
		console.log('Clicked campaign:', campaign.title)
	}
	;<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'></div>

	return sampleCampaigns.length >= 3 ? (
		<Carousel
			itemHeight='h-[570px]'
			autoplay={false}
		>
			{sampleCampaigns.map(campaign => (
				<CampaignCard
					key={campaign.id}
					campaign={campaign}
					onClick={handleCampaignClick}
					className='h-full'
				/>
			))}
		</Carousel>
	) : (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{sampleCampaigns.map(campaign => (
				<CampaignCard
					key={campaign.id}
					campaign={campaign}
					onClick={handleCampaignClick}
				/>
			))}
		</div>
	)
}

export default CampaignList
