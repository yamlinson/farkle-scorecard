class Player < ApplicationRecord
  belongs_to :game
  has_many :turns

  validates :name, presence: true
  validates :name, uniqueness: { scope: :game_id }
end
