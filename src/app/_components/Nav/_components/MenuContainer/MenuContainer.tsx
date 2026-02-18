import styles from './MenuContainer.module.scss'
import { MenuItem } from '@/components/MenuItem/MenuItem'
import Link from 'next/link'

type MenuItemProps = {
	title: string
	url: string
}

interface MenuContainerProps {
	items: MenuItemProps[]
}

export const MenuContainer = ({ items }: MenuContainerProps) => {
	return (
		<div className={styles.menu_container}>
			{items.map((item, index) => (
				<Link href={item.url} key={`${item.title}_${index}`}>
					<MenuItem text={item.title} />
				</Link>
			))}
		</div>
	)
}
