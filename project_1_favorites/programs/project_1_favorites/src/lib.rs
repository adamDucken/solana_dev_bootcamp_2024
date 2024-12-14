use anchor_lang::prelude::*;

declare_id!("7zFiQa99TGNVCjxHAkEAchjHs8gNCem8853P2fTVUn9b");

pub const ANCHOR_DISCRIMINATION_SIZE: usize = 8;

#[program]
pub mod project_1_favorites {
    use super::*;

    pub fn set_favorites(
        context: Context<SetFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_public_key = context.accounts.user.key();
        msg!("greetings from {}", context.program_id);
        msg!("user {user_public_key} fav number is {number}, fav color is: {color}",);

        msg!("user hobbies are: {:?}", hobbies);

        context.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATION_SIZE + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump)]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}
