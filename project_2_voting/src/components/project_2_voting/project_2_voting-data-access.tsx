'use client'

import { getProject2VotingProgram, getProject2VotingProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useProject2VotingProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getProject2VotingProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getProject2VotingProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['project_2_voting', 'all', { cluster }],
    queryFn: () => program.account.project_2_voting.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['project_2_voting', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ project_2_voting: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useProject2VotingProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useProject2VotingProgram()

  const accountQuery = useQuery({
    queryKey: ['project_2_voting', 'fetch', { cluster, account }],
    queryFn: () => program.account.project_2_voting.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['project_2_voting', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ project_2_voting: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['project_2_voting', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ project_2_voting: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['project_2_voting', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ project_2_voting: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['project_2_voting', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ project_2_voting: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
