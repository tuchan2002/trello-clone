Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "home#index"

  get "dashboard", to: "dashboard#index"

  resources :boards do
    resources :lists
  end

  namespace :api do
    resources :boards do
      resources :lists, only: [:index], controller: "lists"
      resources :list_positions, only: [:index, :update], controller: "list_positions"
    end
  end
end
