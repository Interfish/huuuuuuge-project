Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'propose#index'
  resource :session, only: [:create, :destroy]
  get :birthday, to: 'birthday#index'
  get :cake, to: 'birthday#cake'
  get :propose, to: 'propose#index'
  resources :photos
end
