import React from 'react'
import NewTransactionCard from './new-transaction-card'

describe('<NewTransactionCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<NewTransactionCard />)
  })
})