import type { NextPage } from 'next'
import IndexPage, { getServerSideIndexProps, IndexProps } from '../client'

const Home: NextPage<IndexProps> = IndexPage

export const getServerSideProps = getServerSideIndexProps

export default Home
