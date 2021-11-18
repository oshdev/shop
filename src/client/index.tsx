import { Item } from '../server/items/items-handler'
import React from 'react'
import items from '../server/items/items.json'

export interface IndexProps {
  items: Item[]
}

const IndexPage: React.FC<IndexProps> = ({ items }) => (
  <>
    <header>
      <h1>Welcome to osh shop</h1>
      <h2>Un unlimited stock of the best quality items are great prices.</h2>
    </header>

    <main>
      <ul>
        {items.map((i) => (
          <li key={i.name}>
            <article>
              <h3>{i.name}</h3>
              <p>${i.price}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  </>
)

export const getServerSideIndexProps = (): { props: IndexProps } => ({
  props: { items },
})

export default IndexPage
