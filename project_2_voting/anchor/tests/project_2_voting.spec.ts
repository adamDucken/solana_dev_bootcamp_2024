import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Project2Voting} from '../target/types/project_2_voting'

describe('project_2_voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Project2Voting as Program<Project2Voting>

  const project_2_votingKeypair = Keypair.generate()

  it('Initialize Project2Voting', async () => {
    await program.methods
      .initialize()
      .accounts({
        project_2_voting: project_2_votingKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([project_2_votingKeypair])
      .rpc()

    const currentCount = await program.account.project_2_voting.fetch(project_2_votingKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Project2Voting', async () => {
    await program.methods.increment().accounts({ project_2_voting: project_2_votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.project_2_voting.fetch(project_2_votingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Project2Voting Again', async () => {
    await program.methods.increment().accounts({ project_2_voting: project_2_votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.project_2_voting.fetch(project_2_votingKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Project2Voting', async () => {
    await program.methods.decrement().accounts({ project_2_voting: project_2_votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.project_2_voting.fetch(project_2_votingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set project_2_voting value', async () => {
    await program.methods.set(42).accounts({ project_2_voting: project_2_votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.project_2_voting.fetch(project_2_votingKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the project_2_voting account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        project_2_voting: project_2_votingKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.project_2_voting.fetchNullable(project_2_votingKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
