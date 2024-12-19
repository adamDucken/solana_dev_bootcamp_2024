// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Project2VotingIDL from '../target/idl/project_2_voting.json'
import type { Project2Voting } from '../target/types/project_2_voting'

// Re-export the generated IDL and type
export { Project2Voting, Project2VotingIDL }

// The programId is imported from the program IDL.
export const PROJECT2_VOTING_PROGRAM_ID = new PublicKey(Project2VotingIDL.address)

// This is a helper function to get the Project2Voting Anchor program.
export function getProject2VotingProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Project2VotingIDL, address: address ? address.toBase58() : Project2VotingIDL.address } as Project2Voting, provider)
}

// This is a helper function to get the program ID for the Project2Voting program depending on the cluster.
export function getProject2VotingProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Project2Voting program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return PROJECT2_VOTING_PROGRAM_ID
  }
}
