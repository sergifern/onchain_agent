'use client'

import { Trophy, Gift, Users, Coins, Star, Clock, Sparkles, Share2, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PageContainer from "@/components/page-container"

export default function LeaderboardPage() {
  // Mock leaderboard data for the blurred table
  const mockLeaderboard = [
    { rank: 1, user: "CryptoWizard", referrals: 47, earnings: "2,847.50", badge: "🏆" },
    { rank: 2, user: "ETHYMaster", referrals: 39, earnings: "2,234.80", badge: "🥈" },
    { rank: 3, user: "DeFiDegen", referrals: 32, earnings: "1,892.40", badge: "🥉" },
    { rank: 4, user: "TokenHunter", referrals: 28, earnings: "1,634.20", badge: "⭐" },
    { rank: 5, user: "SmartTrader", referrals: 24, earnings: "1,421.60", badge: "⭐" },
    { rank: 6, user: "AutomationPro", referrals: 21, earnings: "1,287.30", badge: "💎" },
    { rank: 7, user: "AgentBuilder", referrals: 18, earnings: "1,094.40", badge: "💎" },
    { rank: 8, user: "YieldFarmer", referrals: 15, earnings: "945.50", badge: "🚀" },
  ]

  return (
    <PageContainer title="Referral Leaderboard" description="Earn ETHY by inviting friends">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-6 px-4 py-2 bg-violeta text-white border-none">
            <Sparkles className="h-4 w-4 mr-2" />
            REFERRAL CONTEST COMING SOON
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-violeta">
            EARN ETHY INVITING FRIENDS!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto">
            Get ready for the ultimate referral program! Earn 30% of all ETHY spent by your friends when they execute automations with their agents!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-outline">
              <CardContent className="p-6 text-center">
                <Gift className="h-12 w-12 mx-auto mb-4 text-violeta" />
                <h3 className="text-xl font-semibold mb-2">30% Commission</h3>
                <p className="text-muted-foreground">Every time your friend uses ETHY for agent automations, you earn 30%!</p>
              </CardContent>
            </Card>

            <Card className="card-outline">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-violeta" />
                <h3 className="text-xl font-semibold mb-2">Unlimited Referrals</h3>
                <p className="text-muted-foreground">No limits! Invite as many friends as you want and multiply your earnings!</p>
              </CardContent>
            </Card>

            <Card className="card-outline">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-violeta" />
                <h3 className="text-xl font-semibold mb-2">Leaderboard Rewards</h3>
                <p className="text-muted-foreground">Top referrers get exclusive bonuses and special recognition!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center mb-12">
          <Card className="card-outline max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Clock className="h-16 w-16 mx-auto mb-4 text-violeta animate-spin" />
              <h2 className="text-3xl font-bold mb-4">Referral Links Coming Soon!</h2>
              <p className="text-muted-foreground text-lg mb-6">
                We're putting the finishing touches on the most rewarding referral system in DeFi. 
                Get ready to start earning passive ETHY!
              </p>
              <Button 
                disabled 
                className="button-filled px-8 py-4 text-lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Get My Referral Link
                <ArrowUpRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">Coming very soon...</p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Preview Section */}
        <h2 className="text-xl mb-4 text-secondary flex items-center gap-2 mt-12">
          <Trophy className="h-5 w-5" />
          Leaderboard Preview
        </h2>
        <p className="text-muted-foreground mb-6">
          This is what the competition will look like when it launches!
        </p>

        <Card className="card-outline relative overflow-hidden mb-12">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-violeta" />
              Top Referrers
              <Trophy className="h-5 w-5 text-violeta" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <Clock className="h-16 w-16 mx-auto mb-4 text-violeta animate-pulse" />
                <p className="text-2xl font-bold mb-2">COMING SOON</p>
                <p className="text-muted-foreground">Real competition starts when referral links go live!</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-medium">Rank</TableHead>
                  <TableHead className="font-medium">User</TableHead>
                  <TableHead className="text-center font-medium">Referrals</TableHead>
                  <TableHead className="text-center font-medium">ETHY Earned</TableHead>
                  <TableHead className="text-center font-medium">Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaderboard.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell className="text-center font-semibold">
                      {entry.rank}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.user}
                    </TableCell>
                    <TableCell className="text-center text-violeta font-semibold">
                      {entry.referrals}
                    </TableCell>
                    <TableCell className="text-center text-violeta font-semibold">
                      {entry.earnings} ETHY
                    </TableCell>
                    <TableCell className="text-center text-2xl">
                      {entry.badge}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center">
          <Card className="card-outline max-w-3xl mx-auto">
            <CardContent className="p-8">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-violeta animate-pulse" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Dominate the Leaderboard?
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                The biggest opportunity in DeFi referrals is coming. 
                Be among the first to know when we launch!
              </p>
              <div className="flex items-center justify-center gap-4 text-violeta">
                <Star className="h-6 w-6" />
                <span className="text-lg font-semibold">Stay tuned for the launch announcement!</span>
                <Star className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
