// Shared point logic lives in ../lib/points.js so serverless API can reuse it.
export * from '../lib/points.js'

export interface ScoreBreakdownInput {
  games?: number
  skills?: number
  tierIdx?: number
}
